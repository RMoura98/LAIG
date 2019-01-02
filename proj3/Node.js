/**
 * @constructor Node
 * @param string id
 */

function MyNode(id) {

	this.id = id;

	this.materialId = [];			      	    //Id to the material
	this.materialIdPos = null;            		//Position of current material

	this.textureId = null;				        //Id to the texture

	this.textureLength = [];				    //texture factor s and t [s,t]

	this.matTransf = mat4.create();       		//Transformation matrix
	mat4.identity(this.matTransf);

	this.descendants = [];               		//Every direct descendant

	this.primitive = null;                		//Primitive

	this.animations = [];                 		//Id to animation

	this.pieceRow = null;
	this.pieceColumn = null;
}

MyNode.prototype.insertChild = function (nodeId) {
	this.descendants.push(nodeId);
}

MyNode.prototype.setPosition = function (x, y, z) {
	var newMatrix = mat4.create();
	mat4.identity(newMatrix);

	mat4.identity(this.matTransf);

	mat4.translate(this.matTransf, this.matTransf, [x, y, z]);


}

MyNode.prototype.updateMatrix = function (newMatrix) {
	mat4.multiply(this.matTransf, this.matTransf, newMatrix);
}

MyNode.prototype.resetMatrix = function (newMatrix) {
	mat4.identity(this.matTransf);

	mat4.multiply(this.matTransf, this.matTransf, newMatrix);

}

MyNode.prototype.resetPosition = function() {
	this.pieceRow = null;
	this.pieceColumn = null;
}