import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product

  constructor(private productService: ProductService,
              private route: ActivatedRoute, private cartService: CartService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
      this.handleProductDetails();
    })
    this.cartService.persistCartItems()
  }

  handleProductDetails() {
    //get 'id' param string. convert string to a number using the "+" symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToCart(){
    console.log(`adding ${this.product.name} and ${this.product.unitPrice}`)
    const theCartItem = new CartItem(this.product)
    this.cartService.addToCart(theCartItem)
    this.toastr.success(`Đã thêm ${this.product.name} vào giỏ hàng thành công!`)
  }
}
