import { Scene } from "../scene";
import { Nullable } from "../types";
import { Scalar } from "../Maths/math.scalar";
import { RawTexture } from "../Materials/Textures/rawTexture";
import { Constants } from "../Engines/constants";
/**
 * Defines HermiteCurveKey type
 * It is like IAnimationKey but all define
 */
export interface IHermiteCurveKey {
    /**
     * Frame of the key frame
     */
    frame: number;
    /**
     * Value at the specifies key frame
     */
    value: number;
    /**
     * The input tangent for the cubic hermite spline
     */
    inTangent: number;
    /**
     * The output tangent for the cubic hermite spline
     */
    outTangent: number;
}
/**
 * Define HermiteCurve
 * It is like Animation but only support one value type
 */
export class HermiteCurve {
    /**
     * The hremit Keys
     */
    public keys: IHermiteCurveKey[] = [];
    /**
     * To convert value with hermite
     * @param process value to sampler from Curve (from 0 ~ 1)
     * @returns sampler value
     */
    public getValue(process: number): number {
        if (this.keys.length === 0) {
            return 1;
        }
        if (this.keys.length === 1) {
            return this.keys[0].value;
        }
        if (process <= 0) {
            return this.keys[0].value;
        }
        if (process >= 1) {
            return this.keys[this.keys.length - 1].value;
        }
        for (var key = 1; key < this.keys.length; key++) {
            var endKey = this.keys[key];
            if (endKey.frame > process) {
                const startKey = this.keys[key - 1];
                const amount = (process - startKey.frame) / (endKey.frame - startKey.frame);
                return Scalar.Hermite(startKey.value, startKey.outTangent, endKey.value, endKey.inTangent, amount);
            }
        }
        return 0;
    }

    /**
     * 从Hermite Curve创建RawTexture 只支持 1:R 3:RGB 4:RGBA
     * @param scene 
     * @param curves 
     * @param width 
     * @returns 
     */
    public static createTexture(scene: Scene, array: HermiteCurve[], width: number): Nullable<RawTexture> {
        const count = array.length;
        const data = new Float32Array(width * count);
        const maxWidthIndex = width - 1;
        for (let widthIndex = 0; widthIndex < width; widthIndex++) {
            for (let cI = 0; cI < count; cI++) {
                //[0,1]
                data[widthIndex * count + cI] = array[cI].getValue(widthIndex / maxWidthIndex);
            }
        }
        if (data.length === 1) {
            return RawTexture.CreateRTexture(data, width, 1, scene, false, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE);
        }
        if (data.length === 3) {
            return RawTexture.CreateRGBTexture(data, width, 1, scene, false, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE);
        }
        if (data.length === 4) {
            return RawTexture.CreateRGBATexture(data, width, 1, scene, false, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE);
        }
        return null;
    }
}