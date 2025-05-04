import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';
import { getPosts } from '../../api/getPosts';
import style from './style.module.css';

const PostList: React.FC = () => {
  const observerTarget = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['posts'],
      queryFn: (param) => getPosts(param.pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const allPosts = data?.pages.flatMap((page) => page?.posts) || [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts</div>;

  return (
    <>
      <ul className={style.postsList}>
        {allPosts.map((item) => (
          <li className={style.postItem} key={item?.id}>
            <h3 className={style.postTitle}>{item?.title}</h3>
            <p className={style.postDescription}>{item?.body}</p>
          </li>
        ))}
      </ul>
      <div ref={observerTarget} style={{ height: '1px' }}></div>
      {isFetchingNextPage && (
        <div style={{ textAlign: 'center', padding: '20px', margin: '20px 0' }}>
          Loading more...
        </div>
      )}

      {!hasNextPage && !isLoading && (
        <div onClick={scrollToTop} className={style.sectionUp}>
          All posts loaded
        </div>
      )}
    </>
  );
};
export default PostList;
