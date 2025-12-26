import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface DoughnutChartConfig {
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
}

export class DoughnutChart {
  private chart: Chart | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private config: DoughnutChartConfig
  ) {
    this.init();
  }

  private init(): void {
    this.chart = new Chart(this.canvas, {
      type: 'doughnut',
      data: {
        labels: this.config.labels,
        datasets: [{
          data: this.config.data,
          backgroundColor: this.config.backgroundColor || [
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 146, 60, 0.8)'
          ],
          borderColor: this.config.borderColor || [
            'rgba(59, 130, 246, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(251, 146, 60, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { 
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  update(config: DoughnutChartConfig): void {
    if (!this.chart) return;

    this.chart.data.labels = config.labels;
    this.chart.data.datasets[0].data = config.data;
    this.chart.update();
  }

  destroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}