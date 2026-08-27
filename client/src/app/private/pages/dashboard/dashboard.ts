import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiData } from '../../../auth/services/api-data';
import { Subject, takeUntil } from 'rxjs';

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  tone: string;
}

interface Activity {
  initials: string;
  name: string;
  action: string;
  time: string;
  tone: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  protected unsubscribe = new Subject<void>();

  protected userName!: string; 

  constructor(public apidata: ApiData, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  protected getUserInfo() {

    this.apidata.verifyToken()
    .pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
      next: res => {
        this.userName = res.name;
        this.cdr.detectChanges();
      },
      error: () => {
      }
    });
  };

  readonly metrics: Metric[] = [
    { label: 'Receita total', value: 'R$ 48.290', change: '+12,8%', trend: 'up', icon: 'payments', tone: 'mint' },
    { label: 'Novos clientes', value: '1.284', change: '+8,4%', trend: 'up', icon: 'group_add', tone: 'coral' },
    { label: 'Pedidos realizados', value: '3.642', change: '+5,1%', trend: 'up', icon: 'shopping_bag', tone: 'blue' },
    { label: 'Taxa de conversão', value: '6,8%', change: '-1,2%', trend: 'down', icon: 'track_changes', tone: 'gold' },
  ];

  readonly sales = [
    { month: 'Jan', value: 58 }, { month: 'Fev', value: 72 }, { month: 'Mar', value: 64 },
    { month: 'Abr', value: 86 }, { month: 'Mai', value: 74 }, { month: 'Jun', value: 94 },
    { month: 'Jul', value: 82 }, { month: 'Ago', value: 100 },
  ];

  readonly activities: Activity[] = [
    { initials: 'MC', name: 'Marina Costa', action: 'concluiu um pedido', time: 'há 8 min', tone: 'coral' },
    { initials: 'RL', name: 'Rafael Lima', action: 'criou uma nova conta', time: 'há 24 min', tone: 'blue' },
    { initials: 'AS', name: 'Ana Souza', action: 'atualizou o cadastro', time: 'há 1 h', tone: 'mint' },
    { initials: 'GB', name: 'Guilherme Barros', action: 'solicitou suporte', time: 'há 2 h', tone: 'gold' },
  ];

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
