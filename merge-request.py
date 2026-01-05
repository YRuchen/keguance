import requests,os,shutil,subprocess,yaml,time,json 
from datetime import datetime

# === 配置区 ===
# obs-frontend helm chart 仓库
REPO_URL = "https://gitlab.gainetics.io/backend-som/observable/starview-helm-chart/starview-console.git"
GITLAB_URL = "https://gitlab.gainetics.io"

# PROJECT NAME = starview-console
PROJECT_ID = 84
PRIVATE_TOKEN = os.getenv("GITLAB_PRIVATE_TOKEN", "")

repo_url_with_auth = f"https://admin:{PRIVATE_TOKEN}@gitlab.gainetics.io/backend-som/observable/starview-helm-chart/starview-console.git"

# 本组件的仓库地址
ORIGIN_REPO_URL = "https://gitlab.gainetics.io/backend-som/observable/obs-frontend.git"
# Service 本组件的仓库项目 ID
ORIGIN_PROJECT_ID = 61
ORIGIN_REPO_PRIVATE_TOKEN = os.getenv("ORIGIN_GITLAB_PRIVATE_TOKEN", "")

# 获取 obs-frontend 组件 main 分支最新一次 commit 的 title、message、author_name、commiter_name
def get_commits_details(project_id, branch, per_page=1):
    """获取分支最近 N 次提交"""
    url = f"{GITLAB_URL}/api/v4/projects/{project_id}/repository/commits"
    params = {
        "ref_name": branch,
        "per_page": per_page
    }
    HEADERS = {
    "PRIVATE-TOKEN": ORIGIN_REPO_PRIVATE_TOKEN
    }
    resp = requests.get(url, headers=HEADERS, params=params)
    resp.raise_for_status()
    data = json.loads(resp.text)
    # print(json.dumps(data[1],indent=2,ensure_ascii=False))
    # 提交标题
    commit_title = data[0]["title"]
    # 提交内容
    commit_message = data[0]["message"].strip()
    # 提交人
    commit_author_name = data[0]["author_name"]
    # 合入的审核人
    commit_committer_name = data[0]["committer_name"]
    # print("标题:%s" % commit_title)
    # print("内容:%s" % commit_message)
    # print("提交人:%s" % commit_author_name)
    # print("审核人:%s" % commit_committer_name) 
    # 封装成 dict
    commit_info = {
        "commit_title": commit_title,
        "commit_message": commit_message,
        "commit_author_name": commit_author_name,
        "commit_committer_name": commit_committer_name
    }
    return commit_info

ORIGIN_REPO_COMMIT_INFO = get_commits_details(ORIGIN_PROJECT_ID,"main","1")

CLEAN_ORIGIN_REPO_COMMIT_MESSAGE = subprocess.run(['git', 'log', '-1', '--pretty=format:%s'],capture_output=True,text=True).stdout.strip()


# === 动态生成 SOURCE_BRANCH 并创建新分支 ===
timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
SOURCE_BRANCH = f"main-auto-merge-{timestamp}"

TARGET_BRANCH = "main"
TITLE = CLEAN_ORIGIN_REPO_COMMIT_MESSAGE
REMOVE_SOURCE_BRANCH = "true"

if os.path.exists("starview-console"):
    print("✅ 目录已存在")
    shutil.rmtree("starview-console")
    print("✅ 删除目录成功")
    os.mkdir("starview-console")
    print("✅ 新建目录成功")
else:
    os.mkdir("starview-console")
    print("✅ 新建目录成功")

# === 新增：拉取远程仓库内容 ===
try:
    # 判断是否是 Git 仓库
        subprocess.run(["mkdir", "-p", "starview-console"])
        subprocess.run(["git", "clone", "--branch", TARGET_BRANCH,repo_url_with_auth], check=True, cwd="starview-console")
        subprocess.run(["ls","-al"])
        subprocess.run(["pwd"])

        print("✅ 远程仓库克隆完成")
except subprocess.CalledProcessError as e:
    print(f"❌ Git 拉取失败: {e}")
    exit(1)

# 可选：推送到远程仓库
# try:
subprocess.run(["ls","-al"],cwd="starview-console",check=True)
result = subprocess.run(["git", "checkout", "-b",SOURCE_BRANCH], cwd="starview-console", check=True)
print(result.stdout)
subprocess.run(["git", "config", "--global","user.name","merge"], cwd="starview-console", check=True)
subprocess.run(["git", "config", "--global","user.email","merge@gainetics.io"], cwd="starview-console", check=True)

os.chdir("starview-console/starview-console")
subprocess.run(["pwd"], check=True)
subprocess.run(["ls", "-al"],check=True)
result = subprocess.run(["git", "branch", "-a"], check=True)
print(result.stdout)
result = subprocess.run(["git", "remote","-v"], check=True)
print(result.stdout)
subprocess.run(["git", "checkout","-b", SOURCE_BRANCH], check=True)

# 同步更新 helm-chart/values.yaml 中目标业务组件的 tag 信息
commit_id = os.getenv("GIT_COMMIT")
new_tag = os.getenv("IMAGE_TAG")
with open("values/values-dev.yaml", 'r') as f:
    values = yaml.safe_load(f)

# 打印原始值
print("原来的 tag:", values['image']['tag'])
OLD_TAG = values['image']['tag']

# 替换值
values['image']['tag'] = new_tag
print("替换后的 tag:", values['image']['tag'])

# 保存回文件（可选）
with open("values/values-dev.yaml", 'w') as f:
    yaml.dump(values, f, sort_keys=False)

print(f"✅ 已将 `obs-frontend` 组件的 tag 替换为：{new_tag}")


HELM_COMMIT_MESSAGE = (  
    f"{CLEAN_ORIGIN_REPO_COMMIT_MESSAGE}\n"
    f"obs-frontend组件更新\n"
    f"commit id: {commit_id}\n"
    f"旧:servcie:{OLD_TAG}\n"
    f"新:servcie:{new_tag}\n"
)

result = subprocess.run(["git","add","values/values-dev.yaml"],check=True)
print(result.stdout)
result = subprocess.run(["git","commit","-m",HELM_COMMIT_MESSAGE],check=True)
print(result.stdout)

try:
    result = subprocess.run(["git", "push", "--set-upstream","origin", SOURCE_BRANCH], check=True,capture_output=True,text=True)
    print(result.stderr)
    print(result.stdout)
    print(f"✅ 分支 {SOURCE_BRANCH} 已成功推送到远程仓库")
except subprocess.CalledProcessError as e:
    print(f"❌ Git 推送失败: {e}")
    exit(1)

# === 请求区 ===
url = f"{GITLAB_URL}/api/v4/projects/{PROJECT_ID}/merge_requests"
headers = {
    "PRIVATE-TOKEN": PRIVATE_TOKEN
}

DESCRIPTION_MESSAGE = (  
    f"旧tag信息: servcie:{OLD_TAG}"
    f"  \n新tag信息: servcie:{new_tag}"
)
data = {
    "source_branch": SOURCE_BRANCH,
    "target_branch": TARGET_BRANCH,
    "title": TITLE,
    "description": DESCRIPTION_MESSAGE,
    "remove_source_branch": REMOVE_SOURCE_BRANCH
}

# === 发起请求 ===
response = requests.post(url, headers=headers, data=data)

# === 处理结果 ===
if response.status_code == 201:
    print("✅ Merge Request 创建成功！")
    print("返回内容:", response.json())
    mr_info = response.json()
    print("mr_info:",mr_info)
    mr_iid = mr_info["iid"]
    print("mr_idd:", mr_iid)
else:
    print("❌ 创建失败，状态码:", response.status_code)
    print("错误信息:", response.text)

# === 合并 MR ===
merge_url = f"{GITLAB_URL}/api/v4/projects/{PROJECT_ID}/merge_requests/{mr_iid}/merge"

merge_headers = {
    "PRIVATE-TOKEN": PRIVATE_TOKEN,
    "Content-Type": "application/json"
}

MERGE_COMMIT_MESSAGE = (
    f"旧tag信息: servcie:!{OLD_TAG}\n"
    f"新tag信息: servcie:!{new_tag}\n"
)

merge_data = {
    "merge_commit_message": CLEAN_ORIGIN_REPO_COMMIT_MESSAGE,
    "should_remove_source_branch": True
}

# 等待 10秒 可以正常获取到以上刚创建的 merge request 的信息
time.sleep(10)

merge_resp = requests.put(merge_url, headers=merge_headers, json=merge_data)
if merge_resp.status_code == 200:
    print(f"✅ MR !{mr_iid} 已成功合并")
    print("合并返回:", merge_resp.json())
else:
    print(f"❌ 合并 MR !{mr_iid} 失败, 状态码: {merge_resp.status_code}")
    print("错误信息:", merge_resp.text)    
