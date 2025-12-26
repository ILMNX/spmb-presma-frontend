import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface BarChartConfig {
  labels: string[];
  data: number[];
  label?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export class BarChart {
  private chart: Chart | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private config: BarChartConfig
  ) {
    this.init();
  }

  private init(): void {
    this.chart = new Chart(this.canvas, {
      type: 'bar',
      data: {
        labels: this.config.labels,
        datasets: [{
          label: this.config.label || 'Data',
          data: this.config.data,
          backgroundColor: this.config.backgroundColor || 'rgba(59, 130, 246, 0.8)',
          borderColor: this.config.borderColor || 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }

  update(config: BarChartConfig): void {
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