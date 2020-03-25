const Splicer = {
    stripHidden: function(source, language) {
        if (language === "java")
            return source.substring(0, source.indexOf("/*HIDDEN*/")) + "\n}";
        else
            return source.substring(0, source.indexOf("# hidden")) + "main()";
    },

    compile: function(code, original, language) {
        if (language === "java") {
            let ret = code.substring(0, code.length - 1);
            ret += original.substring(original.indexOf("/*HIDDEN*/"));
            ret = ret.replace("main(String[] args)", "main3(String[] args)");
            ret = ret.replace("main2(String[] args)", "main(String[] args)");
            return ret;
        } else {
            let ret = code.replace("def main()", "def main3()");
            ret = ret.replace("main()", "");
            ret += original.substring(original.indexOf("# hidden"));
            return ret;
        }
    }
};

export { Splicer };
