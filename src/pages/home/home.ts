import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { File } from 'ionic-native';

declare var cordova: any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	files = [];
	currentLocation = [];
	constructor(public navCtrl: NavController, public platform: Platform) {

	}

	ionViewDidLoad() {
		this.getRootFolderList();
	}

	getRootFolderList(){
		if(this.platform.is('cordova')){
			this.platform.ready().then(() => {
					console.log('cordova.file.externalRootDirectory --->', cordova.file.externalRootDirectory);
					File.listDir(cordova.file.externalRootDirectory, '').then((files) => {
						console.log('files list --->', files);
						this.files = files;
						this.currentLocation = [];
					}).catch((err) => {
						console.log('files list error--->', err);
					});
			});
		}
	}

	getPath(dirname){
		return new Promise((resolve, reject) => {
			var path = "";
			if(this.currentLocation.length){
				console.log('inside getPath', dirname);
				console.log('inside path array', this.currentLocation);
				for(var i = 0, l = this.currentLocation.length; i < l; i++){
					path = path + this.currentLocation[i] + '/';
				}
				path = path + dirname;
				console.log('inside getPath path', path);
				resolve(path);
			}else{
				resolve(dirname);
			}
		});
	}

	getFolderList(dirname){
		if(this.platform.is('cordova')){
			this.platform.ready().then(() => {
					console.log('path --->', cordova.file.externalRootDirectory);
					console.log('dirname --->', dirname);
						// this.files = [];
					this.getPath(dirname).then((path: string) => {
						console.log('then metod callvas --> ', path);
						File.listDir(cordova.file.externalRootDirectory, path).then((files) => {
							console.log('files list --->', files);
							this.files = files;
							this.currentLocation.push(dirname);
							console.log('this.currentLocation ---->', this.currentLocation);
							this.files.splice(0, 0, {name: dirname, isFile: false, isDirectory: true, backOption: true});
						}).catch((err) => {
							console.log('files list error--->', err);
						});
					})
			});
		}
	}

	getBackToParent(dirname){
		console.log('this.currentLocation ---->', this.currentLocation);
		this.currentLocation.pop();
		var temp = this.currentLocation.pop();
		console.log('pop --->' , temp);
		if(temp)
			this.getFolderList(temp);
		else
			this.getRootFolderList();
		console.log('this.currentLocation after pop ---->', this.currentLocation);
	}


}
