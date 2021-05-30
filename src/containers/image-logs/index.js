import { CircularProgress } from '@material-ui/core';
import { ImageLogs } from 'components/modules/image-logs';
import { useQuery } from 'react-query';
import { Redirect, useParams } from 'react-router-dom';
import _ from 'lodash';

const ImageLogsContainer = () => {
    const params = useParams();

    const { isLoading: imageLogsAreLoading, data: imageLogs } = useQuery("image_logs", () =>
        fetch(
            `${process.env.REACT_APP_SERVER_URL}/images/${params.id}/logs`
        ).then(res => res.json()),
        {
        }
    );

    if (imageLogsAreLoading) return <CircularProgress />;


    if (imageLogs?.status === 'not found') return <Redirect to='/' />;

    const actions = _.get(imageLogs, 'logs.docs', []);
    return <ImageLogs actions={actions} image={imageLogs.image} />;
};

export default ImageLogsContainer;