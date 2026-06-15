import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '@store';
import {
  clearFeed,
  fetchFeedOrders,
  selectFeedIsLoading,
  selectFeedOrders
} from '@slices/feed/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeedOrders());

    return () => void dispatch(clearFeed());
  }, [dispatch]);

  const isLoading = useSelector(selectFeedIsLoading);
  const orders = useSelector(selectFeedOrders);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchFeedOrders())}
    />
  );
};
