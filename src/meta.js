
import {meta as coreMeta, classes as coreClasses, exclude as coreExclude} from '@oknosoft/wb/core/src';

export const meta = {
  enm: {...coreMeta.enm},
  cat: {
    ...coreMeta.cat,
    workCenterKinds: {
      name: "ВидыРабочихЦентров",
      synonym: "Этапы производства (Виды РЦ)",
      illustration: "",
      objPresentation: "Вид рабочего центра",
      listPresentation: "",
      inputBy: ["name"],
      hierarchical: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      fields: {
        applying: {
          synonym: "Детализация",
          multiline: false,
          tooltip: "Детализация планирования (до элемента, продукции, заказа...)",
          choiceParams: [
            {
              name: "ref",
              "path": [
                "product",
                "layer",
                "parent",
                "elm",
                "order",
                "region"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.plan_detailing"
            ],
            "is_ref": true
          }
        },
        available: {
          synonym: "Всегда доступен",
          multiline: false,
          tooltip: "Не учитывать остатки мощностей",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        predefined_name: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            "str_len": 256
          }
        }
      },
      tabulars: {},
      cachable: "ram",
      id: "sg",
      common: true,
      aliases: ['work_center_kinds'],
    },
    workCenters: {
      name: "РабочиеЦентры",
      synonym: "Рабочие центры",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: ["name", "id"],
      hierarchical: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      fields: {
        department: {
          synonym: "Подразделение",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "catalogs.divisions"
            ]
          }
        },
        "parent": {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "catalogs.work_centers"
            ]
          }
        }
      },
      tabulars: {
        work_center_kinds: {
          name: "ВидыРабочихЦентров",
          synonym: "Виды рабочих центров",
          tooltip: "",
          fields: {
            kind: {
              synonym: "Вид РЦ",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "catalogs.work_center_kinds"
                ]
              }
            }
          }
        }
      },
      cachable: "ram",
      id: "",
      common: true,
      aliases: ['work_centers'],
    },
  }
};

export const classes = [...coreClasses];

export const exclude = [...coreExclude];
