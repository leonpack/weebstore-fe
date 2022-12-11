import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = []

  totalPrice: Subject<number> = new Subject<number>()
  totalQuantity: Subject<number> = new Subject<number>()

  constructor() {
    this.cartItems = JSON.parse(sessionStorage.getItem('cartItems')) != null ?
    JSON.parse(sessionStorage.getItem('cartItems')):[]
   }

  addToCart(theCartItem: CartItem){
    //check if we already have the item in the cart
    let alreadyExistInCart: boolean = false
    let existingCartItem: CartItem = undefined

    if(this.cartItems.length > 0){
    //find the item in the cart based on item's id

    existingCartItem = this.cartItems.find( item => item.id === theCartItem.id)

    //check if we found the item
      alreadyExistInCart = (existingCartItem!=undefined)
    }

    if(alreadyExistInCart) {
      existingCartItem.quantity++
    } else {
      //just add the item to the array
      this.cartItems.push(theCartItem)
    }

    //compute the cart's totalPrice
    this.computeCartTotals()

  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--
    if(theCartItem.quantity == 0){
      this.remove(theCartItem)
    }
    else{
      this.computeCartTotals()
    }
  }
  remove(theCartItem: CartItem) {
    //get index of the array
    const itemIndex = this.cartItems.findIndex( item => item.id === theCartItem.id)
    //if found, remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1)
      this.computeCartTotals()
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0
    let totalQuantityValue: number = 0

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice
      totalQuantityValue += currentCartItem.quantity
    }

    //publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue)
    this.totalQuantity.next(totalQuantityValue)

    //log cart data for debugging
    this.logCartData(totalPriceValue, totalQuantityValue)
    this.persistCartItems()
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    for(let item of this.cartItems){
      const subTotalPrice = item.quantity * item.unitPrice
      console.log(`name: ${item.name}, quantity: ${item.quantity}, unit price: ${item.unitPrice}, total price: ${subTotalPrice}`)
    }
    console.log(totalPriceValue.toFixed(2) + " and " +totalQuantityValue)
    console.log('----')
  }

  //this func is to keep cart item persistence even if browser is refresh
  persistCartItems(){
    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems))
  }
}
