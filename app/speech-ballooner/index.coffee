closestPointToRectDiff = (p, rect) ->
  originDx = rect.origin.x - p.x
  originDy = rect.origin.y - p.y
  maxDx = p.x - (rect.origin.x + rect.size.width)
  maxDy = p.y - (rect.origin.y + rect.size.height)
  dx = Math.max(originDx, 0, maxDx)
  dy = Math.max(originDy, 0, maxDy)

  if dx isnt 0
    dx = -dx * (maxDx / Math.abs(maxDx))
  if dy isnt 0
    dy = -dy * (maxDy / Math.abs(maxDy))

  return new Point(dx,dy)

class Point
  constructor: (@x, @y) ->
  toString: -> "#{@x}, #{@y}"

class Size
  constructor: (@width, @height) ->

class Rect
  constructor: (x, y, width, height) ->
    @origin = new Point x, y
    @size = new Size width, height

class SpeechBallooner
  constructor: (@width, @height, text) ->
    @tail = new Point (0.1 * @width), (0.95 * @height)
    @balloon = new Rect (0.05 * @width), (0.05 * @height), (0.9 * @width), (0.8 * @height)

    @fill = "#FFF"
    @stroke = "#000"
    @strokeWidth = "3"
    @text = text or "He's dead Jim."

  w: (percent) ->
    return (percent / 100 * @balloon.size.width) + @balloon.origin.x

  h: (percent) ->
    return (percent / 100 * @balloon.size.height) + @balloon.origin.y

  getBalloonPoints: ->
    [
      [new Point(@w(0), @h(0)), new Point(@w(0), @h(0)), new Point(@w(50), @h(0))] # top
      [new Point(@w(100), @h(0)), new Point(@w(100), @h(0)), new Point(@w(100), @h(50))] # right
      [new Point(@w(100), @h(100)), new Point(@w(100), @h(100)), new Point(@w(50), @h(100))] # bottom
      [new Point(@w(0), @h(100)), new Point(@w(0), @h(100)), new Point(@w(0), @h(50))] # left
    ]

  getPath: ->
    diff = closestPointToRectDiff(@tail, @balloon)
    points = @getBalloonPoints()

    console.log 'diff', diff

    if diff.x is 0 and diff.y is 0
      #no speech bubble
      path = "M #{points[3][2].toString()}"
    else
      tailStart = new Point(diff.x + @tail.x, diff.y + @tail.y)
      #starting point
      path = "M #{@tail.toString()}"
      #first straight line to speech rect
      path += " L #{tailStart.toString()}"

      if diff.x is 0 and diff.y > 0
        #tail will be at top, go right first
        points.push points.shift() # resort
        tailEnd = new Point tailStart.x - 10, tailStart.y
        tailEndXDiff = tailEnd.x - @balloon.origin.x
        if tailEndXDiff <= 0
          tailEnd = new Point @balloon.origin.x, tailStart.y + 10
      else if diff.x < 0 and diff.y >= 0
        #tail will be at right, go bottom first
        points.push points.shift() # resort
        points.push points.shift() # resort
        tailEnd = new Point tailStart.x, tailStart.y - 10
        tailEndYDiff = tailEnd.y - (@balloon.origin.y)
        if tailEndYDiff <= 0
          tailEnd = new Point tailStart.x - 10, @balloon.origin.y
      else if diff.x <= 0 and diff.y < 0
        #tail will be at bottom, go left first
        points.unshift points.pop() # resort
        tailEnd = new Point tailStart.x + 10, tailStart.y
        tailEndXDiff = tailEnd.x - (@balloon.origin.x + @balloon.size.width)
        if tailEndXDiff > 0
          tailEnd = new Point (@balloon.origin.x + @balloon.size.width), tailStart.y - 10
      else
        #we only need to adjust the tail
        tailEnd = new Point tailStart.x, tailStart.y + 10
        tailEndYDiff = tailEnd.y - (@balloon.origin.y + @balloon.size.height)
        if tailEndYDiff > 0
          tailEnd = new Point tailStart.x + 10, (@balloon.origin.y + @balloon.size.height)

      # edit last point
      points[3][2] = tailEnd

    for point in points
      path += " C"
      for component in point
        path += " " + component.toString()
    path += " Z"

    return path

  getSVG: ->
    """
    <svg width="#{@width}" height="#{@height}">
      <path fill="#{@fill}" stroke="#{@stroke}" stroke-width="#{@strokeWidth}" d="#{@getPath()}" />
      <text alignment-baseline="central" text-anchor="middle" fill="#{@stroke}" x="#{@w(50)}" y="#{@h(45)}">#{@text}</text>
    </svg>
    """

if module && module.exports
  module.exports = SpeechBallooner
