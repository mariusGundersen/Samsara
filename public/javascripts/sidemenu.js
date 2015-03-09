window.onload = function(){
  var PANEL_WIDTH = 200;
  var ICON_WIDTH = 35;
  
  var pointer = null;
  var delta = 0;
  var draggers = document.querySelectorAll('.pane.menu');
  var paneElements = document.querySelectorAll('.pane');
  var panes = createPanes(paneElements, screenSize());
  
  window.addEventListener('resize', handleWindowResize, false);
  
  panes.filter(function(pane){
    return Array.prototype.indexOf.call(pane.element.classList, 'menu') != -1;
  }).forEach(function(dragger, index, draggers){
    dragger.element.querySelector('h2').addEventListener('click', function(){
      handleMenuClicked(panes[panes.length - (2 + index)]);
    }, false);
    dragger.element.addEventListener('pointerdown', handlePointerDown, false);
  });
  document.body.addEventListener('pointermove', handlePointerMove, false);
  document.body.addEventListener('pointerup', handlePointerUp, false);
  document.body.addEventListener('pointerleave', handlePointerUp, false);
  document.body.addEventListener('pointercancel', handlePointerUp, false);
  
  function handleWindowResize(){
    document.body.setAttribute('animate-menus', 'false');
    panes = createPanes(paneElements, screenSize());
    delta = animateRepositionMenus(delta);
    setTimeout(function(){
      document.body.setAttribute('animate-menus', 'true');
    },1);
  }
  
  function handlePointerDown(e){
    if(pointer == null && e.pointerType != "mouse"){
      document.body.setAttribute('animate-menus', 'false');
      pointer = {
        id: e.pointerId,
        startX: e.clientX - delta,
        startY: e.clientY
      };
    }
  }
  
  function handleMenuClicked(pane){
    if(delta == pane.maxPull){
      delta = 0;
    }else{
      delta = pane.maxPull;
    }
    setTimeout(function(){
      delta = repositionMenus(delta);
    },1);
  }
  
  function handlePointerMove(e){
    if(pointer && pointer.id === e.pointerId){
      var dx = e.clientX - pointer.startX;
      var dy = e.clientY - pointer.startY;
      if(!pointer.stable && Math.abs(dx-delta) < Math.abs(dy)){
        pointer = null;
        document.body.setAttribute('animate-menus', 'true');
        return;
      }else{
        pointer.stable = true;
      }
      delta = repositionMenus(dx);
      e.preventDefault();
    }
  }
  
  function handlePointerUp(e){
    if(pointer && pointer.id === e.pointerId){
      var dx = e.clientX - pointer.startX;
      pointer = null;
      document.body.setAttribute('animate-menus', 'true');
      delta = animateRepositionMenus(dx);
    }
  }
  
  function animateRepositionMenus(dx){
    var size = screenSize();
    if(size == -1){
      if(dx < PANEL_WIDTH/2){
        dx = 0;
      }else if(dx < (PANEL_WIDTH+ICON_WIDTH)/2+(PANEL_WIDTH-ICON_WIDTH)){
        dx = PANEL_WIDTH+(panes.length == 3 ? 0 : ICON_WIDTH);
      }else{
        dx = Math.ceil(Math.floor((dx-(PANEL_WIDTH+ICON_WIDTH))/((PANEL_WIDTH-ICON_WIDTH)/2))/2)*(PANEL_WIDTH-ICON_WIDTH)+(PANEL_WIDTH+ICON_WIDTH);
      }
      return repositionMenus(dx);
    }else{
      dx = Math.ceil(Math.floor(dx/((PANEL_WIDTH-ICON_WIDTH)/2))/2)*(PANEL_WIDTH-ICON_WIDTH);
      return repositionMenus(dx);
    }
  }
  
  function repositionMenus(delta){
    var width = document.body.offsetWidth;
    var pulled = panes.reduce(function(pulled, pane){
      return spendPulledOnElement(pane.element, pulled, Math.min(pane.maxPull, width - pane.rightEdge), pane.marginLeft);
    }, Math.max(0, delta));
    
    return Math.max(0, delta - pulled);
  }

  function spendPulledOnElement(element, pulled, maxTotalPull, maxPull){
    translateElement(element, Math.min(pulled, maxTotalPull));
    var sub = Math.min(maxPull, maxTotalPull);
    return pulled < sub ? 0 : pulled - sub;
  }
  
  function translateElement(element, value){
    element.style.transform = "translate("+value+"px)";
  }

  function screenSize(){
    return Math.floor(document.body.offsetWidth/1.5/PANEL_WIDTH)-2;
  }
  
  function createPanes(panes, size){
    var panes = Array.prototype.map.call(paneElements, function(a){return a});
  
    panes = panes.map(function(pane){
      return {
        element: pane,
        widthIcon: ICON_WIDTH,
        widthPane: PANEL_WIDTH,
        marginLeft: PANEL_WIDTH-ICON_WIDTH,
        maxPull: 0,
        leftEdge: 0
      };
    });

    if(size == -1 && panes.length > 2){
      panes[panes.length-2].widthIcon = panes.length == 3 ? 0 : -ICON_WIDTH;
    }

    panes.reduce(function(v, pane, index, panes){
      pane.marginLeft = index < (panes.length-size) ? Math.max(0, v.prevPaneWidth - pane.widthIcon) : 0;
      pane.element.style.marginLeft = "-"+pane.marginLeft+"px";
      pane.maxPull = v.sumMarginLeft + (index < (panes.length-size) ? pane.marginLeft : 0);
      pane.leftEdge = v.sumWidthIcon;
      return {
        sumMarginLeft: v.sumMarginLeft + pane.marginLeft,
        sumWidthIcon: v.sumWidthIcon + pane.widthIcon,
        prevPaneWidth: pane.widthPane
      };
    }, {
      sumMarginLeft:0, 
      sumWidthIcon:0,
      prevPaneWidth:0
    });

    panes.reverse();

    panes.reduce(function(widthIcons, pane){
      widthIcons += pane.widthIcon;
      pane.rightEdge = pane.leftEdge + widthIcons;
      return widthIcons;
    },0);
    
    return panes;
  }
};