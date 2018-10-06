 /**
  * @constructor Node
  * @param string id
  */

 function MyNode(id) {

  this.id = id;

  this.material = null;

  this.texture = null;

  this.matTransfRef = null;

  this.matTransf = mat4.create();
  mat4.identity(this.matTransf);

  this.descendants = [];

  this.primitives = [];
}

MyNode.prototype.insertChild = function (nodeId) {
  this.descendants.push(nodeId);
}

MyNode.prototype.insertPrimitive = function (primitive) {
  this.primitives.push(primitive);
}
