import { url } from 'node:inspector';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Router } from 'express';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink , ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit{
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  flag = signal<string>("cash")

    checkOut : FormGroup = this.formBuilder.group({
    shippingAddress : this.formBuilder.group({

      details:["" , [Validators.required]],
      phone:["" , [Validators.required]],
      city:["" , [Validators.required]],
    }),
  });

  

  cartId = signal<string>("");

  changeFlag(el:HTMLInputElement):void{
    this.flag.set(el.value);
  }

  ngOnInit(): void {
    this.getCartId();
  }

  getCartId(): void {
      this.activatedRoute.paramMap.subscribe( (params)=> {
        params.get('id');

        this.cartId.set(params.get('id')!)
      });
  }

  submitForm():void{
    if(this.checkOut.valid){
      console.log(this.checkOut.value);

      if(this.flag() === 'cash'){
        //call api cash
        this.cartService.createCashOrder(this.cartId() , this.checkOut.value ).subscribe({
          next:(res)=>{
            console.log(res);
            //navigate allorders
            if(res.status === 'success'){
            //navigate allorders
             this.router.navigate(['/allorders']);
             
            }
          },
      });

      }
       else{
        //call api visa
        this.cartService.createVisaOrder(this.cartId() , this.checkOut.value ).subscribe({
          next:(res)=> {
            console.log(res);
            //open url
            if(res.status === 'success'){
              window.open(res.session.url , '_self')
            }
          },
        });
      }

    }
  }

}
