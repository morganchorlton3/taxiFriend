import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoginPage } from '../login/login';
import { map } from 'rxjs/operators';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentMapTrack = null;

  isTracking = false;
  trackedRoute = [];
  previousTracks = [];

  userData : Observable<any>

  positionSubscription: Subscription;

  constructor(public navCtrl: NavController,private toast: ToastController, private afDatabase: AngularFireDatabase,private afAuth: AngularFireAuth, private plt: Platform, public geolocation: Geolocation) {
    this.geolocation.getCurrentPosition().then(pos => {
      let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      let marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        icon: { url : '../assets/icon/user.png' },
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });  
  }
  addUserMarker(){

    var myArray = [new google.maps.LatLng(55.4986562, -3.4003268000000004), new google.maps.LatLng(53.4986562, -6.4003268000000004), new google.maps.LatLng(52.4986562, -5.4003268000000004)]; 

    this.geolocation.getCurrentPosition().then(pos => {
      let latLng = myArray[Math.floor(Math.random() * myArray.length)];
      let marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        icon: { url : '../assets/icon/taxi.png' },
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });  
  }
  random(): number {
    let rand = Math.floor(Math.random()*2);
    return rand;       
 }
  locateMe(){
    this.geolocation.getCurrentPosition().then(pos => {
      let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      this.map.setCenter(latLng);
    }).catch((error) => {
      console.log('Error getting location', error);
    });  
  }

  ionViewDidLoad(){
    this.plt.ready().then(() => {
      this.loadMap();
      this.geolocation.getCurrentPosition().then(pos => {
        let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.map.setCenter(latLng);
        this.map.setZoom(16);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    })
    this.afAuth.authState.subscribe(data =>{
      if(data && data.email && data.uid){
        this.userData = this.afDatabase.object(`profile/${data.uid}`).valueChanges();﻿
      }else{
        this.toast.create({
          message: `Please Login to view your profile`,
          duration: 3000
        }).present();
        this.navCtrl.push(LoginPage);
      }
    })
  }
  loadMap(){
    let latLng = new google.maps.LatLng(53.6466645, -1.7822482);
 
      let mapOptions = {
        center: latLng,
        zoom: 14,
      disableDefaultUI: true,
      styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        },
      ]
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
  }
}
