
var convertMapPoints = require('convertMapPoints'),
    win = Ti.UI.createWindow(),
    pop = new createPopView(),
    popView = pop.view,
    popLabel = pop.label,
    defaultLatitude = 37,
    defaultLongitude = -122,
    pinImage = 'map-pin.png',
    selectedPinImage = 'map-pin-selected.png',
    selectedPin = null,
    pins = [];


for (var i = 0, l = 10; i<l; i++){
    
    var pin = Titanium.Map.createAnnotation({
        latitude:defaultLatitude,
        longitude:defaultLongitude,
        title:"Map Pin "+ i,
        animate:true,
        image: pinImage,
        pinImage:pinImage,
        selectPinImage:selectedPinImage
    });
    
    pins.push(pin);
    
    defaultLatitude+=Math.random()*0.10
    defaultLongitude+=Math.random()*0.10
}


var mapView = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    animate:true,
    region:{latitude:defaultLatitude, longitude:defaultLongitude, latitudeDelta:0.1, longitudeDelta:0.1},
    regionFit:true,
    userLocation: false,
    annotations: pins
}); 

win.add(mapView);
win.add(popView);

mapView.addEventListener('regionchanged', function(evt){
    evt.source.setRegion(evt)
});

mapView.addEventListener('click', function(evt) {
   
    if(evt.clicksource === 'pin' && evt.annotation != selectedPin){
        evt.source.deselectAnnotation(evt.annotation); 
        showPopView(evt);
        evt.annotation.setImage(evt.annotation.selectPinImage);
        if(selectedPin){
            selectedPin.setImage(selectedPin.pinImage);
            selectedPin = evt.annotation;
        } else {
            selectedPin = evt.annotation;
        }
    } else {
        evt.source.deselectAnnotation(evt.annotation); 
    }
    
     
});

win.open();


function createPopView(params){
    var params = params || {};

    var contentView = Ti.UI.createView({
        top:0,
        width:params.width?params.width:200,
        height:params.height?params.height:200,
        backgroundColor:"#000000",
        borderRadius:20
    });
    
    var closeBtn = Ti.UI.createButton({
        backgroundImage:"/close.png",
        top:5,
        right:5,
        height:30,
        width:30
    });
    
    var arrowView = Ti.UI.createView({
        bottom:0,
        height:20,
        width:20,
        backgroundImage:"/arrow.png"
    });
    
    this.label = Ti.UI.createLabel({
        top:20,
        color:"#ffffff",
        height:Ti.UI.SIZE
    })
    
    this.view = Ti.UI.createView({
        height:contentView.height+arrowView.height,
        width:contentView.width,
        visible:false,
        opacity:0.0,
    });
    
    contentView.add(closeBtn, this.label);
    this.view.add(contentView, arrowView);
    
    closeBtn.addEventListener('click', closePopView);
    
}

function closePopView(evt){
    
    mapView.removeEventListener('regionchanged', movePopView);   
    popView.hide();
    selectedPin.setImage(selectedPin.pinImage);
    selectedPin = null;

}

function movePopView(evt){
    
    if(selectedPin){
        var point = convertMapPoints({
            map:evt.source,
            annotation:selectedPin,
            view:win
        });
        popView.center ={x:point.x, y:(point.y-(popView.height/2)-20)};
    }
}

function showPopView(evt){
    
    mapView.addEventListener('regionchanged', movePopView);
   
    var point = convertMapPoints({
        map:mapView,
        annotation:evt.annotation?evt.annotation:selectedPin,
        view:win
    });
    popLabel.text = evt.annotation.title;
    popView.center ={x:point.x, y:(point.y-(popView.height/2)-20)};
    popView.show();
    popView.animate({opacity:1.0, duration:250});
    
}