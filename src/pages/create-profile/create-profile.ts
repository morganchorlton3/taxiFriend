import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { Profile } from '../../models/profile';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-create-profile',
  templateUrl: 'create-profile.html',
})
export class CreateProfilePage {

  profile = {} as Profile;

  constructor( public afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  createProfile(){
    this.afAuth.authState.take(1).subscribe(auth => {
      this.profile.email = this.afAuth.auth.currentUser.email;
      this.afDatabase.object(`profile/${auth.uid}`).set(this.profile)
        .then(() => this.navCtrl.setRoot(HomePage));
    })
  }

}
