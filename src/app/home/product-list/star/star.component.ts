import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})

export class StarComponent implements OnInit {
  @Input() star: string = ''

  LIMIT_STAR: number = 5
  starEnable: number[] = []
  starDisable: number[] = []
  constructor() { }

  ngOnInit(): void {
    this.starEnable = Array(Number(this.star) % this.LIMIT_STAR)
    this.starDisable = Array(this.LIMIT_STAR - Number(this.star) % this.LIMIT_STAR)
  }

}
