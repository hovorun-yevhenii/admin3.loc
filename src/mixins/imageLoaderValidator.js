const loaderValidator = {
    methods: {
        validateLoadingImage(file) {
            return new Promise((res, rej) => {
                let typeReader = new FileReader(),
                    baseReader = new FileReader(),
                    MAX_SIZE_IN_BYTES = 2097152,
                    header = '',
                    type = '';

                typeReader.readAsArrayBuffer(file);
                typeReader.addEventListener('loadend', arrayBuffer => {
                    new Uint8Array(arrayBuffer.target.result)
                        .subarray(0, 4)
                        .forEach(byte => header += byte.toString(16));

                    switch (header) {
                        case "89504e47":
                            type = "image/png";
                            break;
                        case "ffd8ffe0":
                        case "ffd8ffe1":
                        case "ffd8ffe2":
                        case "ffd8ffe3":
                        case "ffd8ffe8":
                            type = "image/jpeg";
                    }

                    if (type && file.size < MAX_SIZE_IN_BYTES) {
                        baseReader.readAsDataURL(file);
                        baseReader.addEventListener('load', () => res(baseReader.result));
                    } else rej();
                });
            })
        }
    }
};

export default loaderValidator;