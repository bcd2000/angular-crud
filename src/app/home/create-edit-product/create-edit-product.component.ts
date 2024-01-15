import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductItem } from 'src/app/type/type';

@Component({
  selector: 'app-create-edit-product',
  templateUrl: './create-edit-product.component.html',
  styleUrls: ['./create-edit-product.component.css']
})
export class CreateEditProductComponent implements OnInit {
  createEditForm!: FormGroup;
  productOrg!: ProductItem;
  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.createEditForm = this.formBuilder.group({
      productName: [''],
      imgUrl: [''],
      star: [''],
      price: ['']
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    this.productService.getProductItem(id || '').subscribe((prdItem: ProductItem) => {
      this.productOrg = prdItem
      this.createEditForm.setValue({
        productName: prdItem.productName,
        imgUrl: prdItem.imgUrl,
        star: prdItem.star,
        price: prdItem.price
      })
    })
    
  }

  onSubmit() {
    this.productService.updateProductItem({
      ...this.productOrg,
      ...this.createEditForm.value,
    }).subscribe(item => {
      console.log(item)
    })
  }
}
