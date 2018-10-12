 /**
  * @constructor Node
  * @param string id
  */

 function MyNode(id) {

  this.id = id;

  this.materialId = null;				//Id to the material

  this.textureId = null;				//Id to the texture

  this.textureLength = [];				//texture factor s and t [s,t]

  this.matTransfRef = null;             //id to a global transformation matrix

  this.matTransf = mat4.create();       //Transformation matrix
  mat4.identity(this.matTransf);

  this.descendants = [];                //Every direct descendant

  this.primitive = null;                //Primitive
}

MyNode.prototype.insertChild = function (nodeId) {
  this.descendants.push(nodeId);
}
