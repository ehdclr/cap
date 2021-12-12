import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/User';
import { reUser } from '../../models/reUser';
import { analyzeFileForInjectables } from '@angular/compiler';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from 'src/app/services/validate.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-homecustomer',
  templateUrl: './homecustomer.component.html',
  styleUrls: ['./homecustomer.component.scss'],
})
export class HomecustomerComponent implements OnInit {
  name: string;
  phone: string;
  date: any;
  username: string;
  usersQuantity: number = 0;
  
  
  reuser :any;
  id : string;
  elementType ='text';
 
  Cuser: string;
  customerQrcode :string;
  customerQrcode2 :string;
  reservePhone: string;

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService 
    ,private validateService: ValidateService) {}
  users: any;
  users2:[];

  public modal: boolean = false;

  public modal2: boolean = false;

  clickedModalClose() {
    this.modal = false;
    
  }

  clickedModal() {
    this.modal = true
    
  
  }

  clickedModal2() {
    this.modal2 = true
    
  
  }

  clickedModalClose2() {
    this.modal2 = false;
    
  }



  

  ngOnInit(): void {
    this.authService.getList().subscribe((users) => {
      this.users = users
      

      

      
      
      
        
      

    });

    

//     this.authService.getCustomerinfo().subscribe((customers) =>{
      
//       this.reuser = customers;

//       this.Cuser= JSON.stringify(customers);
//       this.customerQrcode=this.Cuser;
          
    
    
    

      


// },
//  (err) => {
//   console.log(err);
//   return false;
// }

// );

    

    
  }
  getAlllist(){
    this.authService.getList().subscribe((users) => {
      this.users = users;
      
      this.usersQuantity = users.length;
      
      
    });
  }

  onReserveSubmit() :any{

    var regExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

    if(!regExp.test(this.phone)){
      

      Swal.fire({
        icon: 'warning',
        title: '등록실패',
        text: '올바른 전화번호를 입력해주세요.',
        
        
    });
    return false;
      
    }


    const reuser = {
      _id : this.id,
      name: this.name,
      phone: this.phone,
      date: this.date,
      
      
    };
    const currentTime = new Date().getTime();
    var currentTimeStr=  String(currentTime);
    
    


    this.authService.reserveUser(reuser).subscribe((data) => {
      if (data.success) {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 3000,
        });
        console.log(data);
        const request1 ={
          renewuser: data.renewuser,
          currentTime: currentTime,
        }
        
        const ReserveRequest = JSON.stringify(request1);
        this.customerQrcode= ReserveRequest;
        // qr코드에 담긴 정보 

         localStorage.setItem('id',data.renewuser._id);
         localStorage.setItem('name',data.renewuser.name);
         localStorage.setItem('phone',data.renewuser.phone);
         localStorage.setItem('date',data.renewuser.date);
         localStorage.setItem('reservetime',currentTimeStr);
         
        
        
        
        

        console.log(ReserveRequest);
        
        this.getAlllist();
        this.router.navigate(['/homecustomer']);
      } else {
        this.flashMessage.show(data.msg,{
          cssClass: 'alert-dnager',
          timeout:3000,
        });
        this.router.navigate(['/homecustomer']);
      }
    });
  }

  checkReserve(){
    var id = localStorage.getItem('id')
    var name =localStorage.getItem('name');
    var phone=localStorage.getItem('phone');
    var date =localStorage.getItem('date');
    var time =localStorage.getItem('reservetime');

    var time2 = Number(time);

    const reuser2 ={
      _id : id,
      name: name,
      phone: phone,
      date: date,
    }
         
    
    if (phone = this.reservePhone) {
      this.flashMessage.show("예약 정보가 확인 되었습니다.");
      

      const request2 ={
        renewuser: reuser2,
        currentTime: time2
      }

      

      const ReserveRequest = JSON.stringify(request2);
      this.customerQrcode2= ReserveRequest;


    } else {

      this.flashMessage.show("예약 정보가 확인 되지 않습니다.")

    }





  }

  

}
