/**
 * MyInterface
 * @constructor
 */


function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);

    this.cameraIndice = 0;
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    // add a button:
    // the first parameter is the object that is being controlled (in this case the scene)
    // the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
    // e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); };

    //this.gui.add(this.scene, 'doSomething');

    // add a group of controls (and open/expand by defult)

    var group = this.gui.addFolder("Options");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;
    for (i = 1; i <= this.scene.nrLuzes; i++) {
        this.nomeLuz = ("luz" + i);
        group.add(this.scene, this.nomeLuz);
    }
    //group.add(this.scene, 'option1');
    //group.add(this.scene, 'option2');

    // add a slider
    // must be a numeric variable of the scene, initialized in scene.init e.g.
    // this.speed=3;
    // min and max values can be specified as parameters

    return true;
};

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyDown = function(event) {
    // call CGFinterface default code (omit if you want to override)
    CGFinterface.prototype.processKeyDown.call(this, event);

    // Check key codes e.g. here: http://www.asciitable.com/
    // or use String.fromCharCode(event.keyCode) to compare chars

    // for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
    switch (event.keyCode) {
        case (86):
            {
                this.cameraIndice++;
                this.cameraIndice = this.scene.updateCamera(this.cameraIndice);
                break;
            }
        case (118):
            {
                this.cameraIndice++;
                this.cameraIndice = this.scene.updateCamera(this.cameraIndice);
                break;
            }
        case (109):
            {
                this.scene.updateMaterials();
                break;
            }
        case (77):
            {
                this.scene.updateMaterials();
                break;
            }
        case(27):{
                if(this.scene.game.SelectedWall!=null || this.scene.game.SelectedPeca!=0)
                  this.scene.game.State--;
                this.scene.game.SelectedObj=null;
                this.scene.game.SelectedWall=null;
                this.scene.game.SelectedPeca=0;

                break;
            }
    };
};
