<script setup lang="tsx">
import { computed } from 'vue'
import { DetectionCard } from '../constants'
import { IconFont } from '~/KeepUp'

const emit = defineEmits(['change'])
const props = defineProps<{
  data?: DetectionCard[]
}>()

const detectionCards = computed<DetectionCard[]>(() => props.data || [])

const handleCardClick = (card: DetectionCard) => {
  if (card.status === 'error') {
    emit('change', card.key)
  }
}
</script>
<template>
  <section class="card-section">
    <div class="card-grid">
      <div
        v-for="card in detectionCards"
        :key="card.key"
        class="detect-card"
        :class="{ 'is-error': card.status === 'error' }"
        @click="handleCardClick(card)"
      >
        <div class="card-icon">
          <div class="icon-wrapper">
            <IconFont
              :name="card.iconName"
              color="white"
              style="filter: drop-shadow(0px 0px 4px #007dff)"
            ></IconFont>
          </div>
        </div>
        <div class="card-content">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-status is-normal">
            <template v-if="card.status === 'error'">
              <div class="card-error">
                <el-icon color="#ff282b">
                  <WarningFilled />
                </el-icon>
                <span class="error-badge">异常:{{ card.errorCount }}</span>
              </div>
            </template>
            <template v-else>
              <span>正常</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.card-section {
  margin-bottom: 20px;

  .card-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .detect-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e1e7f5;
      background: #ffffff;
      transition: all 0.2s;
      position: relative;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      &.is-error {
        background: linear-gradient(90deg, #ffffff 50%, #fce1e2 100%);
      }

      &.is-normal {
        border-color: #e1e7f5;
        background: #ffffff;
      }

      .card-icon {
        flex-shrink: 0;

        .icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: radial-gradient(
            circle at top left,
            #86d8ff 0%,
            #9bc9ff 20%,
            #eaf0ff 70%,
            #87cbff 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 4px rgba(0, 125, 255, 0.3);
          position: relative;

          .icon-placeholder {
            font-size: 20px;
            color: #ffffff;
            font-weight: 600;
          }
        }
      }

      .card-content {
        flex: 1;
        display: flex;
        flex-direction: row;
        gap: 8px;
        justify-content: space-between;
        align-items: center;

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2c4c;
        }

        .card-status {
          font-size: 16px;
          font-weight: 500;

          &.is-normal {
            color: #2f88ff;
          }

          .card-error {
            display: flex;
            flex-direction: column;
            align-items: center;

            .error-badge {
              display: inline-block;
              color: #ff4757;
              padding: 4px 10px;
              border-radius: 4px;
              font-weight: 500;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
