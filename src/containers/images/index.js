import React, { useRef, useState, useCallback } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import PhotoUploadModal from 'components/modules/photo-upload-modal';
import { CustomDataGrid } from 'components/modules/custom-data-grid';
import { Box, Button, CircularProgress } from '@material-ui/core';
import AddImageIcon from '@material-ui/icons/AddAPhoto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQueryClient, useInfiniteQuery, useMutation } from 'react-query';
import _ from 'lodash';


const columns = [
    {
        field: 'id',
        headerName: 'ID'
    },
    {
        field: 'path',
        headerName: 'Path',
    },
]

const ImagesContainer = () => {
    const queryClient = useQueryClient();
    const [modalInfo, setModalInfo] = useState({ open: false });

    const handleClose = () => {
        setModalInfo({
            open: false
        });
    };

    const {
        isLoading: imagesAreLoading,
        data: imagesData,
        fetchNextPage: fetchNextImagesPage,
        isFetchingNextPage: fetchingMoreImages,
    } = useInfiniteQuery(["images"], ({ pageParam = 1 }) =>
        fetch(
            `${process.env.REACT_APP_SERVER_URL}/images?page=${pageParam}`
        ).then((res) => res.json()),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            getNextPageParam: (lastPage, allPages) => _.defaultTo(lastPage.images.nextPage, undefined),
            getPreviousPageParam: (firstPage, allPages) => firstPage.images.prevPage
        }
    );

    const { mutate: addPhoto, isLoading: addImageIsLoading } = useMutation((payload) => fetch(
        `${process.env.REACT_APP_SERVER_URL}/images`, {
        method: 'POST',
        body: payload
    }
    ).then((res) => res.json()).then(res => {
        handleClose();
        toast.success('Image Successfully Uploaded');
        queryClient.setQueryData('images', data => ({
            ...data,
            pages: data.pages.map((page, idx) => idx !== 0 ? page : ({
                ...page,
                images: {
                    ...page.images,
                    docs: [res.image, ...page.images.docs]
                }
            }))
        }))
    }));

    const { mutate: deleteImage, isLoading: deleteImageLoading } = useMutation(({ image_id, cb }) => fetch(
        `${process.env.REACT_APP_SERVER_URL}/images/${image_id}`,
        {
            method: 'DELETE'
        }
    ).then(res => res.json()).then(res => {
        cb();
        queryClient.setQueryData('images', data => ({
            ...data,
            pages: data.pages.map(page => {
                console.log(page)
                const newImages = page.images.docs.filter(image => image._id !== image_id)
                return ({
                    ...page, images: {
                        ...page.images,
                        docs: newImages,
                    }
                });
            })
        }))
    }));

    const fileRef = useRef(null);

    const onHandleSetImage = (e) => {
        const path = URL.createObjectURL(e.target.files[0]);
        setModalInfo({
            open: true,
            image: path,
            file: e.target.files[0]
        })
    }

    const onUpload = (info, image) => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('actions', JSON.stringify(info));
        addPhoto(formData);
    };

    const rows = _.get(imagesData, 'pages', []).reduce((acc, page) => {
        const pageData = page.images.docs.map(image => ({ id: image._id, path: image.path }));
        return [...acc, ...pageData];
    }, []);

    const handleOnBottomScroll = useCallback(() => {
        if (!fetchingMoreImages) fetchNextImagesPage();
    }, [fetchingMoreImages, fetchNextImagesPage]);

    return (<div>
        <Box m={2}>
            <Button
                color='primary'
                variant='contained'
                onClick={() => fileRef.current.click()}
                startIcon={<AddImageIcon />}
            > Upload Image</Button>
        </Box>
        <input type='file' ref={fileRef} onChange={onHandleSetImage} value="" accept='.jpg,.png,.jpeg' style={{ display: 'none' }} />
        { imagesAreLoading ? <CircularProgress /> :
            <CustomDataGrid
                columns={columns}
                rows={rows}
                handleRemoveItems={deleteImage}
                removeIsLoading={deleteImageLoading}
                handleOnBottomScroll={handleOnBottomScroll}
                fetchingMoreData={fetchingMoreImages}
            />
        }
        { modalInfo.open &&
            <PhotoUploadModal
                open={modalInfo.open}
                image={modalInfo.image}
                onClose={handleClose}
                loading={addImageIsLoading}
                onUpload={(info, image) => onUpload(info, modalInfo.file)}
            />
        }
        <ToastContainer />
    </div>)
}

export default ImagesContainer;