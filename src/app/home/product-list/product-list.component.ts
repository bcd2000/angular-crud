import { ProductItem } from 'src/app/type/type';
import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  listProduct!: ProductItem[];

  constructor(private prdService: ProductService, private route: Router) { }

  ngOnInit(): void {
    this.prdService.getProductList().subscribe(data => {
      this.listProduct = data
    })
  }

  addProduct() {
    this.route.navigate(['home', 'create-product'])
  }

  goToEditProduct(id: string) {
    this.route.navigate(['home', 'create-product'], { queryParams: {id}})
  }
}
