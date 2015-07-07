###
 * @ngdoc overview
 * @name angularComicApp
 * @description
 * # angularComicApp
 *
 * Main module of the application.
###

angular
.module 'app', [
  'ngAnimate',
  'ngSanitize',
  'ui.bootstrap',
  'app-templates'
]

.directive 'balloonEditor', ->
  controller: 'AppController'
  templateUrl: 'app.tpl'

.controller 'AppController', ($scope, $timeout) ->

  $scope.svg = svg =
    canvasWidth : 600
    canvasHeight : 400
    text : "I am a stinky monkey"
    balloon:
      width: 80
      height: 40
      x: 50
      y: 10
    tail:
      x: 200
      y: 100

  balloonControls = document.getElementById('balloonControls')
  balloonControls.setAttribute 'data-x', svg.balloon.x
  balloonControls.setAttribute 'data-y', svg.balloon.y
  balloonControls.style.top = svg.balloon.y + 'px'
  balloonControls.style.left = svg.balloon.x + 'px'
  balloonControls.style.width = svg.balloon.width + 'px'
  balloonControls.style.height = svg.balloon.height + 'px'
  tailControls = document.getElementById('tailControls')
  tailControls.setAttribute 'data-x', svg.tail.x
  tailControls.setAttribute 'data-y', svg.tail.y
  tailControls.style.top = svg.tail.y + 'px'
  tailControls.style.left = svg.tail.x + 'px'

  $scope.$watch 'svg', ->
    area = document.getElementById 'renderArea'
    while (area.firstChild)
      area.removeChild(area.firstChild)
    speech = new SpeechBallooner svg.canvasWidth, svg.canvasHeight, svg.text
    speech.tail = new Point svg.tail.x, svg.tail.y
    speech.balloon = new Rect svg.balloon.x, svg.balloon.y, svg.balloon.width, svg.balloon.height
    balloon = angular.element speech.getSVG()
    area.appendChild balloon[0]
  , yes

  interact('#balloonControls')
  .draggable
    restrict:
      restriction: document.getElementById 'containment'
    onmove: (event)->
      target = event.target
      # keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
      # translate the element
      target.style.top = y + 'px'
      target.style.left = x + 'px'
      svg.balloon.y = y
      svg.balloon.x = x
      # update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
      $scope.$apply()
  .resizable
    edges: { left: true, right: true, bottom: true, top: true }
  .on 'resizemove', (event) ->
    target = event.target
    x = (parseFloat(target.getAttribute('data-x')) || 0)
    y = (parseFloat(target.getAttribute('data-y')) || 0)

    # update the element's style
    target.style.width  = event.rect.width + 'px'
    target.style.height = event.rect.height + 'px'
    svg.balloon.width = event.rect.width
    svg.balloon.height = event.rect.height

    # translate when resizing from top or left edges
    x += event.deltaRect.left
    y += event.deltaRect.top

    # translate the element
    target.style.top = y + 'px'
    target.style.left = x + 'px'
    svg.balloon.y = y
    svg.balloon.x = x

    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
    $scope.$apply()

  interact('#tailControls')
  .draggable
    onmove: (event)->
      target = event.target
      # keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
      # translate the element
      target.style.top = y + 'px'
      target.style.left = x + 'px'
      svg.tail.y = y
      svg.tail.x = x
      # update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
      $scope.$apply()
