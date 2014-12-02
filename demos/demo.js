'use strict';

window.onload = function () {
  var svgMorpheus = new SVGMorpheus('#icon'),
      selIcon     = document.getElementById('selIcon'),
      selEasing   = document.getElementById('selEasing'),
      selDuration = document.getElementById('selDuration'),
      selRotation = document.getElementById('selRotation'),
      icons={
        '3d_rotation':'3D Rotation',
        'accessibility':'Accessibility',
        'account_balance':'Account Balance',
        'account_box':'Account Box',
        'account_circle':'Account Circle',
        'add_shopping_cart':'Add Shopping Cart',
        'android':'Android',
        'backup':'Backup',
        'bookmark':'Bookmark',
        'bug_report':'Bug Report',
        'credit_card':'Credit Card',
        'delete':'Delete',
        'done':'Done',
        'drawer':'Drawer',
        'event':'Event',
        'exit_to_app':'Exit To App',
        'explore':'Explore',
        'extension':'Extension',
        'favorite':'Favorite',
        'help':'Help',
        'history':'History',
        'home':'Home',
        'https':'Https',
        'info':'Info',
        'input':'Input',
        'invert_colors':'Invert Colors',
        'label':'Label',
        'language':'Language',
        'launch':'Launch',
        'loyalty':'Loyalty',
        'polymer':'Polymer',
        'print':'Print',
        'receipt':'Receipt'
      },
      easings={
        'circ-in': 'Circ In','circ-out': 'Circ Out','circ-in-out': 'Circ In/Out',
        'cubic-in': 'Cubic In', 'cubic-out': 'Cubic Out', 'cubic-in-out': 'Cubic In/Out',
        'elastic-in': 'Elastic In', 'elastic-out': 'Elastic Out', 'elastic-in-out': 'Elastic In/Out',
        'expo-in': 'Expo In', 'expo-out': 'Expo Out', 'expo-in-out': 'Expo In/Out',
        'linear': 'Linear',
        'quad-in': 'Quad In', 'quad-out': 'Quad Out', 'quad-in-out': 'Quad In/Out',
        'quart-in': 'Quart In', 'quart-out': 'Quart Out', 'quart-in-out': 'Quart In/Out',
        'quint-in': 'Quint In', 'quint-out': 'Quint Out', 'quint-in-out': 'Quint In/Out',
        'sine-in': 'Sine In','sine-out': 'Sine Out','sine-in-out': 'Sine In/Out'
      },
      durations=[250, 500, 750, 1000, 5000],
      rotations={
        'clock': 'Clockwise',
        'counterclock': 'Counterclockwise',
        'random': 'Random',
        'none': 'None'
      };

  var key, i, len;

  for(key in icons) {
    selIcon.options[selIcon.options.length]=new Option(icons[key], key);
  }

  for(key in easings) {
    selEasing.options[selEasing.options.length]=new Option(easings[key], key);
  }

  for(i=0, len=durations.length;i<len;i++) {
    selDuration.options[selDuration.options.length]=new Option(durations[i], durations[i]);
  }

  for(key in rotations) {
    selRotation.options[selRotation.options.length]=new Option(rotations[key], key);
  }


  selIcon.selectedIndex=selIcon.options.length-1;
  selEasing.selectedIndex=15;
  selDuration.selectedIndex=2;
  selRotation.selectedIndex=0;

  function getSelValue(sel) {
    return sel.options[sel.selectedIndex].value;
  }

  var timeoutInstance, manualChange=false;
  function onIconChange() {
    clearTimeout(timeoutInstance);
    var valIcon=getSelValue(selIcon),
        valEasing=getSelValue(selEasing),
        valDuration=getSelValue(selDuration),
        valRotation=getSelValue(selRotation);
    svgMorpheus.to(valIcon, {duration: valDuration, easing: valEasing, rotation: valRotation},!manualChange?launchTimer:null);
  }
  function timerTick() {
    var selIndex=selIcon.selectedIndex;
    while(selIndex===selIcon.selectedIndex) {
      selIndex=Math.round(Math.random()*(selIcon.options.length-1));
    }
    selIcon.selectedIndex=selIndex;
    onIconChange();
  }
  function launchTimer() {
    timeoutInstance=setTimeout(timerTick, 1000);
  }
  selIcon.addEventListener('change', onIconChange);
  selIcon.addEventListener('click',function(){
    clearTimeout(timeoutInstance);
    manualChange=true;
  });

  launchTimer();
};