import { FormEvent, useState } from "react";
import styled from "styled-components";
import Button from "../common/Button";
import Input from "../common/Input";
import Dropdown from "../ui/Dropdown";
import { ReviewPayload } from "../../models/review.model";
import { listBooks } from "../../data/bookRepository";

interface ReviewFormProps {
  onSubmit: (payload: ReviewPayload) => Promise<void>;
  submitting: boolean;
}

const BOOK_OPTIONS = listBooks().map(book => ({
  label: `${book.title} (${book.category})`,
  value: book.id,
}));

function ReviewForm({ onSubmit, submitting }: ReviewFormProps) {
  const [author, setAuthor] = useState("게스트");
  const [bookId, setBookId] = useState<number>(BOOK_OPTIONS[0]?.value ?? 1);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;

    await onSubmit({ author, bookId, rating, content: content.trim() });
    setContent("");
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <Row>
        <Field>
          <FieldLabel>작성자</FieldLabel>
          <Input
            value={author}
            onChange={event => setAuthor(event.target.value)}
            required
            placeholder="닉네임"
          />
        </Field>
        <Dropdown
          label="도서 선택"
          value={bookId}
          onChange={event => setBookId(Number(event.target.value))}
          options={BOOK_OPTIONS}
        />
      </Row>

      <Dropdown
        label="평점"
        value={rating}
        onChange={event => setRating(Number(event.target.value))}
        options={[1, 2, 3, 4, 5].map(value => ({ label: `★ ${value}`, value }))}
      />

      <Field>
        <FieldLabel>내용</FieldLabel>
        <TextArea
          placeholder="강의와 책을 기반으로 느낀 점을 남겨주세요."
          value={content}
          onChange={event => setContent(event.target.value)}
          required
        />
      </Field>

      <Button type="submit" disabled={submitting}>
        {submitting ? "작성 중..." : "리뷰 작성"}
      </Button>
    </FormWrapper>
  );
}

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const FieldLabel = styled.span`
  font-size: 14px;
`;

const TextArea = styled.textarea`
  min-height: 120px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.third};
  font-family: inherit;
`;

export default ReviewForm;
