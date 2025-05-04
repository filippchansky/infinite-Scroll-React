import axios from 'axios';
import { IPost } from '../models';

const LIMIT = 10;

export const getPosts = async (page: number) => {
  const res = await axios.get<IPost[]>(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${LIMIT}`
  );

  if (res.status <= 200)
    return {
      posts: res.data,
      nextPage: res.data.length === LIMIT ? page + 1 : undefined,
    };
};
