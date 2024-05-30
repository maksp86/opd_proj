import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Image, FloatingLabel, Form, Modal } from "react-bootstrap"
import Cropper from 'react-easy-crop'
import { ApiContext } from "../../context/api.context";
import { UserContext } from "../../context/user.context";
import getErrorMessage from "../../extras/getErrorMessage";
import { ModalContext } from "../../context/modal.context";

function UserEditModal() {
    const modalContext = useContext(ModalContext)
    const userContext = useContext(UserContext)
    const api = useContext(ApiContext);

    const [formData, setFormData] = useState({ name: userContext.user.name, bio: userContext.user.bio })
    const [errors, setErrors] = useState({})

    const [isImageCrop, setIsImageCrop] = useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const setField = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        })

        if (errors[field]) setErrors({
            ...errors,
            [field]: null
        })
    }

    useEffect(() => {
        if (api.error) {
            console.log("UserEditModal error", api.error);
            let errors = {}
            if (api.error.status === "validation_failed" && api.error.errors) {
                api.error.errors.forEach((error) => errors[error.path] = getErrorMessage(error.msg))
                api.error.preventNext = true;
                api.clearError();
                errors.summary = getErrorMessage(api.error.status)
            }
            setErrors(errors)
        }
    }, [api.error])

    async function processEdit() {
        setErrors({
            ...errors,
            summary: null
        })

        if (!formData.image) {
            setErrors({ ...errors, image: getErrorMessage("field_empty") });
            return
        }
        const imageUploadData = new FormData()
        imageUploadData.append("type", "avatar")
        imageUploadData.append("permissions", "744")
        imageUploadData.append("file", formData.image)

        const imageUploadResult = await api.request("/attachments/upload", "POST", imageUploadData)

        if (imageUploadResult && imageUploadResult.data.value) {
            console.log("Image uploaded ", imageUploadResult)
            const result = await api.request("/user/edit", "POST", { ...formData, image: imageUploadResult.data.value._id })

            if (result)
                modalContext.close()
        }
    }

    async function getCroppedImg(imageSrc, pixelCrop) {
        const image = await createImageBitmap(imageSrc)
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );
        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        );

        return canvas;
    }

    async function OnCropComplete() {
        setIsImageCrop(false)
        const cropCanvas = await getCroppedImg(formData.image, croppedAreaPixels)
        cropCanvas.toBlob((blob) => setField("image", blob))
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{isImageCrop ? "Crop image" : "Edit user"}</Modal.Title>
            </Modal.Header>
            <Container>
                {
                    !isImageCrop && <>
                        <Row className="text-center">
                            <Col>
                                <FloatingLabel
                                    controlId="nameInput"
                                    label="Name"
                                    className="mb-3">
                                    <Form.Control
                                        disabled={api.busy}
                                        type="name"
                                        placeholder="user"
                                        value={formData.name || ""}
                                        onChange={(e) => setField("name", e.target.value)}
                                        isInvalid={!!errors.name} />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingTextarea2" label="Bio">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Enter something cool about yourself"
                                        style={{ minHeight: '150px', maxHeight: '300px' }}
                                        rows={2}
                                        maxLength={255}
                                        className="mb-3"
                                        disabled={api.busy}
                                        value={formData.bio || ""}
                                        onChange={(e) => setField("bio", e.target.value)}
                                        isInvalid={!!errors.bio} />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.bio}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm="auto">
                                <Image roundedCircle
                                    style={{ backgroundColor: "#000", width: "10vh", height: "10vh" }}
                                    src={formData.image ? URL.createObjectURL(formData.image) : (userContext.user.image && ("/api/attachments/get?id=" + userContext.user.image))} />
                            </Col>
                            <Col>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Upload your photo</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp"
                                        disabled={api.busy}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setField("image", e.target.files[0])
                                                setIsImageCrop(true)
                                            }
                                        }}
                                        isInvalid={!!errors.image}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.image}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="px-4">
                            <Button variant="primary" type="button" disabled={api.busy}
                                onClick={() => processEdit()}>
                                Save
                            </Button>
                        </Row>
                    </>}
                {
                    isImageCrop && <>
                        <Row className="mb-3">
                            <Col>
                                <div
                                    style={{
                                        position: "relative",
                                        height: "30vh",
                                        width: "100%",
                                        borderRadius: "10px",
                                        overflow: "hidden"
                                    }}>
                                    <Cropper
                                        image={URL.createObjectURL(formData.image)}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1 / 1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={(_, croppedAreaPixels) => {
                                            setCroppedAreaPixels(croppedAreaPixels);
                                        }} />
                                </div>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col xs="9" className="d-grid">
                                <Button onClick={OnCropComplete}>Next</Button>
                            </Col>
                        </Row>
                    </>
                }
            </Container>
        </>
    )
}

export default UserEditModal;