const fs = require('fs');
const path = require('path');

function ParseEnvironementVariable(str) {
    return str.replace(/\!(.+)\!/gi, (match, string) => process.env[string]).replace(/\%(.+)\%/gi, (match, string) => process.env[string]);
}

function PathJoin(...args) {
    return ParseEnvironementVariable(path.join(...args));
}

function ReadJsonFile(...filepath) {
    try {
        let content = fs.readFileSync(PathJoin(...filepath), 'utf-8');
        let data = JSON.parse(content);

        return data;
    } catch(err) {
        console.error(err);
        return {};
    }
}

function walk(dir) {
    let run = (d) => fs.readdirSync(d).flatMap(e => fs.statSync(PathJoin(d, e)).isDirectory() ? run(PathJoin(d, e)) : PathJoin(d, e));
    return run(dir);
};

function escapeUnicode(char) {
    let unicode = char.charCodeAt(0).toString(16).toUpperCase();
    return '\\u' + ('0000' + unicode).slice(-4);
}

function escapeUnicodeInString(str) {
    return str.replace(/[\uE000-\uF8FF]/g, escapeUnicode);
}

let arguments = process.argv.slice(2);

const MC_LANGS = { "af_za": "Afrikaans (Suid-Afrika)", "ar_sa": "Arabic", "ast_es": "Asturian", "az_az": "Azerbaijani", "ba_ru": "Bashkir", "bar": "Bavarian", "be_by": "Belarusian", "bg_bg": "Bulgarian", "br_fr": "Breton", "brb": "Brabantian", "bs_ba": "Bosnian", "ca_es": "Catalan", "cs_cz": "Czech", "cy_gb": "Welsh", "da_dk": "Danish", "de_at": "Austrian German", "de_ch": "Swiss German", "de_de": "German", "el_gr": "Greek", "en_au": "Australian English", "en_ca": "Canadian English", "en_gb": "British English", "en_nz": "New Zealand English", "en_pt": "Pirate English", "en_ud": "Upside down British English", "en_us": "American English", "enp": "Modern English minus borrowed words", "enws": "Early Modern English", "eo_uy": "Esperanto", "es_ar": "Argentinian Spanish", "es_cl": "Chilean Spanish", "es_ec": "Ecuadorian Spanish", "es_es": "European Spanish", "es_mx": "Mexican Spanish", "es_uy": "Uruguayan Spanish", "es_ve": "Venezuelan Spanish", "esan": "Andalusian", "et_ee": "Estonian", "eu_es": "Basque", "fa_ir": "Persian", "fi_fi": "Finnish", "fil_ph": "Filipino", "fo_fo": "Faroese", "fr_ca": "Canadian French", "fr_fr": "European French", "fra_de": "East Franconian", "fur_it": "Friulian", "fy_nl": "Frisian", "ga_ie": "Irish", "gd_gb": "Scottish Gaelic", "gl_es": "Galician", "haw_us": "Hawaiian", "he_il": "Hebrew", "hi_in": "Hindi", "hr_hr": "Croatian", "hu_hu": "Hungarian", "hy_am": "Armenian", "id_id": "Indonesian", "ig_ng": "Igbo", "io_en": "Ido", "is_is": "Icelandic", "isv": "Interslavic", "it_it": "Italian", "ja_jp": "Japanese", "jbo_en": "Lojban", "ka_ge": "Georgian", "kk_kz": "Kazakh", "kn_in": "Kannada", "ko_kr": "Korean", "ksh": "Kölsch/Ripuarian", "kw_gb": "Cornish", "la_la": "Latin", "lb_lu": "Luxembourgish", "li_li": "Limburgish", "lmo": "Lombard", "lo_la": "Lao", "lol_us": "LOLCAT", "lt_lt": "Lithuanian", "lv_lv": "Latvian", "lzh": "Literary Chinese", "mk_mk": "Macedonian", "mn_mn": "Mongolian", "ms_my": "Malay", "mt_mt": "Maltese", "nah": "Nahuatl", "nds_de": "Low German", "nl_be": "Dutch, Flemish", "nl_nl": "Dutch", "nn_no": "Norwegian Nynorsk", "no_no": "Norwegian Bokmål", "oc_fr": "Occitan", "ovd": "Elfdalian", "pl_pl": "Polish", "pt_br": "Brazilian Portuguese", "pt_pt": "European Portuguese", "qya_aa": "Quenya (Form of Elvish from LOTR)", "ro_ro": "Romanian", "rpr": "Russian (Pre-revolutionary)", "ru_ru": "Russian", "ry_ua": "Rusyn", "sah_sah": "Yakut", "se_no": "Northern Sami", "sk_sk": "Slovak", "sl_si": "Slovenian", "so_so": "Somali", "sq_al": "Albanian", "sr_cs": "Serbian (Latin)", "sr_sp": "Serbian (Cyrillic)", "sv_se": "Swedish", "sxu": "Upper Saxon German", "szl": "Silesian", "ta_in": "Tamil", "th_th": "Thai", "tl_ph": "Tagalog", "tlh_aa": "Klingon", "tok": "Toki Pona", "tr_tr": "Turkish", "tt_ru": "Tatar", "uk_ua": "Ukrainian", "val_es": "Valencian", "vec_it": "Venetian", "vi_vn": "Vietnamese", "vp_vl": "Viossa", "yi_de": "Yiddish", "yo_ng": "Yoruba", "zh_cn": "Chinese Simplified (Mainland China; Mandarin)", "zh_hk": "Chinese Traditional (Hong Kong SAR; Mix)", "zh_tw": "Chinese Traditional (Taiwan; Mandarin)", "zlm_arab": "Malay (Jawi)" };

// Default Settings
let MinecraftFolder     = '%appdata%/.minecraft';
let RessourcePackFolder = './';
let LangConfigFile      = './lang.json';
let PrettyOutput = false;

const SCRIPT_COMMANDS = [
    {
        name: ["--help", "-h"],
        description: "Fait du bon café",
        run: () => {
            SCRIPT_COMMANDS.forEach(cmd => {
                console.log(cmd.name.join(', '));
                console.log(cmd.description);
                console.log('');
            });
            process.exit();
        }
    },
    {
        name: ["--minecraft-dir", "-mc"],
        description: ".minecraft folder location",
        run: () => {}
    },
    {
        name: ["--minecraft-version", "-v"],
        description: ".minecraft folder location",
        run: () => {
            MinecraftFolder = arguments.shift();
        }
    },
    {
        name: ["--ressource-pack-dir", "--dir", "-d"],
        description: "Location of the pack to set translation",
        run: () => {
            RessourcePackFolder = arguments.shift();
        }
    },
    {
        name: ["--file", "-f"],
        description: "Choose the input lang config file",
        run: () => {
            LangConfigFile = arguments.shift();
        }
    },
    {
        name: ["--pretty", "-p"],
        description: "Toggle pretty json output ✨",
        run: () => {
            PrettyOutput = !PrettyOutput;
        }
    },
];

while (arguments.length) {
    let command = arguments.shift();
    
    let cmd = SCRIPT_COMMANDS.find(cmd => cmd.name.includes(command.toLowerCase()));
    if (cmd) cmd.run();
}

(async () => {
    // fs.readdirSync(path.join(RessourcePackFolder))
    
    // Get lang config
    let model = ReadJsonFile(PathJoin(LangConfigFile));


    // Get all objects files;
    let objects = new Map();
    for (let object of walk(PathJoin(MinecraftFolder, 'assets', 'objects'))) {
        let name = object.split('\\').pop();
        objects.set(name, object);
    }


    // Get last index file
    let indexes = fs.readdirSync(PathJoin(MinecraftFolder, 'assets', 'indexes')).sort((a,b) => Number(a.slice(0,-5) - Number(b.slice(0,-5))));
    let JsonIndex = ReadJsonFile(MinecraftFolder, 'assets', 'indexes', indexes.pop());
    
    let index = new Map();
    for (let key of Object.keys(JsonIndex.objects)) {
        index.set(key, JsonIndex.objects[key]);
    }

    // Process langs
    for (let lang_code in MC_LANGS) {
        let file = index.get("minecraft/lang/" + lang_code + ".json");

        console.log(`Compiling ${MC_LANGS[lang_code]} (${lang_code}.json)...`);

        let base_lang;
        if (lang_code == 'en_us') {
            base_lang = ReadJsonFile('./en_us.json');
        } else
        if (file) {
            base_lang = ReadJsonFile(objects.get(file.hash));
        }

        if (base_lang) {
            let lang = {};

            for (let key in model) {
                if (typeof model[key] === "string") {
                    lang[key] = model[key];
                } else
                if (typeof model[key] === "object" && !Array.isArray(model[key])) {
                    if (model[key].text !== undefined) {
                        console.log(model[key].text);

                        lang[key] = model[key].text;
                    } else
                    if (model[key].prefix !== undefined) {
                        lang[key] = model[key].prefix + base_lang[key];
                    } else
                    if (model[key].suffix !== undefined) {
                        lang[key] = base_lang[key].suffix + model[key];
                    } else {
                        console.error(`'${lang[key]}' is invalid`);
                    }
                } else {
                    console.error(`Unknown type in model file : (${typeof model[key]}) ${model[key]}`);
                }
            }

            fs.writeFileSync(PathJoin(RessourcePackFolder, 'assets/minecraft/lang/', lang_code + '.json'), escapeUnicodeInString( JSON.stringify(lang, null, PrettyOutput ? 2 : 0) ));
        } else {
            console.error(lang_code, 'not found');
        }
    }
})();