import styled from "styled-components";
import { Book } from "../../models/book.model";
import { Review } from "../../models/review.model";
import { formatDistanceToNow } from "../../utils/date";

interface ReviewCardProps {
  review: Review;
  book?: Book;
  onClick?: () => void;
}

function ReviewCard({ review, book, onClick }: ReviewCardProps) {
  return (
    <Card type="button" onClick={onClick}>
      <Header>
        <span>{review.author}</span>
        <Badge>{book ? book.title : `도서 #${review.bookId}`}</Badge>
      </Header>
      <Rating>★ {review.rating} / 5</Rating>
      <Content>{review.content}</Content>
      <Meta>{formatDistanceToNow(review.createdAt)} 작성</Meta>
    </Card>
  );
}

const Card = styled.button`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.secondary};
  text-align: left;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-weight: 700;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.third};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
`;

const Rating = styled.span`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const Content = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
`;

export default ReviewCard;
