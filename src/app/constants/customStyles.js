export const customStyles = {
    control: (styles) => ({
        ...styles,
        width: "100%",
        maxWidth: "26.5rem",
        minWidth: "12rem",
        borderRadius: "5px",
        color: "#001219",
        fontSize: "0.8rem",
        lineHeight: "1.75rem",
        backgroundColor: "#FFFFFF",
        cursor: "pointer",
        border: "2px solid #ffffff",
        boxShadow: "5px 5px 0px 0px #0077b6;",
        ":hover": {
            border: "2px solid #000000",
            boxShadow: "none",
        },
    }),
    option: (styles) => {
        return {
            ...styles,
            color: "#001219",
            fontSize: "0.8rem",
            lineHeight: "1.75rem",
            width: "100%",
            background: "#fff",
            ":hover": {
                backgroundColor: "rgb(243 244 246)",
                color: "#000",
                cursor: "pointer",
            },
        };
    },
    menu: (styles) => {
        return {
            ...styles,
            backgroundColor: "#fff",
            maxWidth: "26.5rem",
            border: "2px solid #000000",
            borderRadius: "5px",
            boxShadow: "5px 5px 0px 0px #0077b6;",
        };
    },

    placeholder: (defaultStyles) => {
        return {
            ...defaultStyles,
            color: "#001219",
            fontSize: "0.8rem",
            lineHeight: "1.75rem",
        };
    },
};