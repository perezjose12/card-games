import { PalavraModel } from "../models/palavras.models";
import { PalavraPTModel } from "../models/palavras_pt.models";

/**
 * @description
 * Enum para los campos del modelo UserModel.
 */

export enum TABLES {
    PALAVRAS_PORTUGUES = 'palavras_pt',
    PALAVRAS_INGLES = 'palavras_en',
}

/**
 * @description
 * Modelos para la base de datos segun el schema
 */
export interface MODEL_SCHEMA {
    [TABLES.PALAVRAS_PORTUGUES]: PalavraModel;
    [TABLES.PALAVRAS_INGLES]: PalavraPTModel;   
}