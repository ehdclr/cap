import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { User, Users } from '../../models/User';
// import { Users } from '../../models/cus.num';
import { CustomersService } from 'src/app/services/customers.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import jsQR, {QRCode} from 'jsqr';
import { reUser } from '../../models/reUser';


@Component({
  selector: 'app-homestore',
  templateUrl: './homestore.component.html',
  styleUrls: ['./homestore.component.scss'],
})
export class HomestoreComponent implements OnInit {
  customers: reUser[] = [];
  usersQuantity: number = 0;
  users: any;

  canvasElement: HTMLCanvasElement;
  canvasContext: any;
  video: HTMLVideoElement;
  request: any;

  stream: MediaStream | undefined;
  no: number = 1;

  name: string;
  phone: string;
  date : any;
  password: string;

  reuser:reUser;

  constructor(
    private authService: AuthService,
    
    private flashMessage: FlashMessagesService,
    private router: Router,

    

  ) {
    this.authService.getList().subscribe((users)=>{
      this.customers = users;
      this.usersQuantity =users.length;

    });

  }

  public modal: boolean = false;

  clickedModalClose() {
    this.modal = false;
  }

  clickedModal() {
    this.modal = true;
  }

  ngOnInit(): void {

    this.getAlllist();
    this.authService.getList().subscribe((users) => {
      this.users = users;
      this.usersQuantity = users.length;
    });

  
    // this.customersService.getCustomers().subscribe((data) => {
    //   this.customers = data;
    //   this.customersQuantity = data.length;
    // });

    this.canvasElement= <HTMLCanvasElement>(
      document.getElementById('scan-canvas')
      );
      this.canvasContext= this.canvasElement.getContext('2d');
      this.video= <HTMLVideoElement>document.createElement('video');
      navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(async(stream: MediaStream) => {
        this.video.srcObject= stream;
        this.video.setAttribute('playsinline', 'true'); 
        // required to tell iOS safari we don't want fullscreen
        await this.video.play();
        requestAnimationFrame(this.tick.bind(this));
      });



  }


  getAlllist(){
    this.authService.getList().subscribe((users) => {
      this.users = users;
      this.usersQuantity = users.length;
    });
  }

  drawLine(begin, end, color): void {  // QR이체크되면라인을그림
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(begin.x, begin.y);
    this.canvasContext.lineTo(end.x, end.y);
    this.canvasContext.lineWidth= 4;
    this.canvasContext.strokeStyle= color;
    this.canvasContext.stroke();
}


tick(): void {
  if (this.video.readyState=== this.video.HAVE_ENOUGH_DATA) {
    this.canvasElement.hidden= false;
    this.canvasElement.height= this.video.videoHeight;
    this.canvasElement.width= this.video.videoWidth;
    this.canvasContext.drawImage(
      this.video,0,0,
      this.canvasElement.width,
      this.canvasElement.height
      );
      const imageData: ImageData= this.canvasContext.getImageData(
        0,0,
        this.canvasElement.width,
        this.canvasElement.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {         // 코드가체크되면코드바운더리를그림
          this.drawLine(
            code.location.topLeftCorner,
            code.location.topRightCorner,
            '#FF3B58'
            );
          this.drawLine(
            code.location.topRightCorner,
            code.location.bottomRightCorner,
            '#FF3B58'
            );
          this.drawLine(
            code.location.bottomRightCorner,
            code.location.bottomLeftCorner,
            '#FF3B58'
            );
          this.drawLine(
            code.location.bottomLeftCorner,
            code.location.topLeftCorner,
            '#FF3B58'
            );
           
          this.request= JSON.parse(code.data);   
          //여기에 qr 입력시 받은 자료 보내기
          this.QRenroll(this.request);
          

          
        } else { }
      }
      requestAnimationFrame(this.tick.bind(this));
    }

  

  deleteCustomer(id : string) {
    Swal.fire({
      title: '회원 삭제',
      text: '정말로 회원을 삭제 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.value) {
        this.authService.deleteCustomer_1(id);
        this.users = this.users.filter(
          (users) => users._id !== id
        );
        
        this.usersQuantity = this.usersQuantity - 1;
        Swal.fire('성공!', '예약이 취소 되었습니다.');
        
        
        this.getAlllist();
        localStorage.removeItem('name');
        localStorage.removeItem('date');
        localStorage.removeItem('phone');
        localStorage.removeItem('reservetime');
        localStorage.removeItem('id');

        
      }
    });
    
    
    
  }

  

  QRenroll(request) {
    this.authService.authenticateQRcustomer(request).subscribe((data) => {
      if(data.success) {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 5000,
        });
        this.router.navigate(['homestore']);
        
        // console.log(`${data.renewuser.name}`+"데이터 삭제완료");
        console.log(request.renewuser._id);
        console.log(data);
        this.authService.deleteCustomer_1(request.renewuser._id);
        console.log(`${request.renewuser.name}`+"님의 데이터 삭제완료.");
        Swal.fire(`${request.renewuser.name}`+"님의 데이터 삭제완료.");
        this.getAlllist();
        localStorage.removeItem('name');
        localStorage.removeItem('date');
        localStorage.removeItem('phone');
        localStorage.removeItem('reservetime');
        localStorage.removeItem('id');

      } else {
        this.flashMessage.show(data.msg,{
          cssClass: 'alert-danger',
            timeout: 5000,
            
        });
        
        this.router.navigate(['homestore']);
      }


    });

  }
  
}
