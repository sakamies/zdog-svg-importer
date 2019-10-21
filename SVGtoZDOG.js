//Has only been tested with lines & shapes exported from Sketch. Completely ignores transforms. Just reads path points as they are.

//Takes any bunch of svg elements, parses them to zDog and adds them to the given zDog anchor
//Parses only lines & paths for now

function SVGtoZDOG (elements, anchor) {
  const zShapes = [...elements].map(el => addShape(el, anchor))
  // console.log({zShapes})
  return Object.fromEntries(zShapes)
}

function addShape (element, anchor) {

  const zPath = convertElement(element)
  // console.log({zPath})

  if (!zPath) {
    return
  }

  //Set element depth by appending -z100 to element id
  const id = element.id.split('-z')
  const name = id[0]
  const z = parseFloat(id[1])
  const color = element.getAttribute('stroke') || element.getAttribute('fill')
  const fill = element.getAttribute('fill') != undefined ? true : false
  const stroke = element.getAttribute('stroke-width')

  const shapeEntry = [
    name,
    new Zdog.Shape({
      addTo: anchor,
      ...zPath,
      translate: {z},
      fill: fill,
      stroke: stroke,
      color: color,
    })
  ]
  return shapeEntry
}

function convertElement (element) {
  switch (element.tagName) {
    case 'line': return convertLine(element)
    case 'path': return convertPath(element)
    default: return null
  }
}

function convertLine (lineElement) {
  const obj = {
    closed: false,
    path: [
      {
        x: lineElement.getAttribute('x1'),
        y: lineElement.getAttribute('y1'),
        z: 0
      },
      {
        x: lineElement.getAttribute('x2'),
        y: lineElement.getAttribute('y2'),
        z: 0
      }
    ]
  }
  // console.log({lineElement, obj})
  return obj
}

function convertPath (pathElement) {
  //Assumes path format that Sketch uses.
  //Will fail if path syntax is a bit different
  //Supports M C L Z (no S or A)

  //Split string at commands, while retaining commands in split parts
  //Positive lookahead capture group so the split delimiter is included in the results
  let pathString = pathElement.getAttribute('d')
  let pathArray = pathString.split(/(?= [MCLZ])/)
  pathArray = pathArray.map(convertPathPart)
  pathArray = pathArray.filter(x => x != null)

  const obj = {
    closed: pathString.endsWith('Z'),
    path: pathArray
  }
  // console.log({pathElement, pathString, pathArray, obj})
  return obj
}

function convertPathPart (pathPart) {
  // console.log({pathPart})
  pathPart = pathPart.trim()
  switch (pathPart.slice(0,1)) {
    case 'M': return convertMoveCommand(pathPart)
    case 'L': return convertLineCommand(pathPart)
    case 'C': return convertBezierCommand(pathPart)
    default: return null
  }
}

function convertMoveCommand (command) {
  //M550.099679,442.364356
  const point = command.slice(1)
  return {
    'move': zVector(point)
  }
}

function convertLineCommand (command) {
  //L681.914062,744.925232
  const point = command.slice(1)
  return {
    'line': zVector(point)
  }
}

function convertBezierCommand (command) {
  //C548.7,513.8 354.5,710.7 237.9,712.6
  command = command.slice(1)
  const points = command.split(' ')
  return {
    'bezier': [
      zVector(points[0]), //Start control point
      zVector(points[1]), //End control point
      zVector(points[2])  //End point
    ]
  }
}

function zVector (pathPoint) {
  // console.log({pathPoint})
  const xy = pathPoint.split(',')
  return {
    x: xy[0],
    y: xy[1],
    z: 0
  }
}



