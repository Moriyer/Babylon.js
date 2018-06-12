/// <reference path="../../../../dist/preview release/babylon.d.ts"/>

module BABYLON.GUI {
    /**
     * Class used to create a button in 3D
     */
    export class MeshButton3D extends Button3D {
        /** @hidden */
        protected _currentMesh: Mesh;

        /**
         * Creates a new 3D button based on a mesh
         * @param mesh mesh to become a 3D button
         * @param name defines the control name
         */
        constructor(mesh: Mesh, name?: string) {
            super(name);
            this._currentMesh = mesh; 

            this.pointerEnterAnimation = () => {
                if (!this.mesh) {
                    return;
                }
                //this.mesh.scaling.scaleInPlace(0.95);
            }

            this.pointerOutAnimation = () => {
                
            }    

            this.pointerDownAnimation = () => {
                if (!this.mesh) {
                    return;
                }

                this.mesh.scaling.scaleInPlace(0.95);
            }

            this.pointerUpAnimation = () => {
                if (!this.mesh) {
                    return;
                }
                this.mesh.scaling.scaleInPlace(1.0 / 0.95);
            }                     
        }

        protected _getTypeName(): string {
            return "MeshButton3D";
        }        

        // Mesh association
        protected _createNode(scene: Scene): TransformNode {
            this._currentMesh.getChildMeshes().forEach((mesh)=>{
                mesh.metadata = this;
            });
            return this._currentMesh;
        }

        protected _affectMaterial(mesh: AbstractMesh) {
        }

        /**
         * Releases all associated resources
         */
        public dispose() {
            super.dispose();

            if (this._currentMesh) {
                this._currentMesh.dispose();
            }
        }
    }
}