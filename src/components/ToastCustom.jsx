import toast from "react-hot-toast";

const ToastCustom = (message, type = "success", toastId = null) => {
    const options = {
        position: "top-center",
        style: {
            border: "1px solid #739BF2",
            padding: "16px",
            color: "#739BF2",
            backgroundColor: "#F7F1F2",
        },
    };

    if (type === "loading") {
        return toast.loading(message, options);
    }
    if (toastId) {
        return toast[type](message, { ...options, id: toastId });
    }
    return toast[type](message, options);
};

export default ToastCustom;
