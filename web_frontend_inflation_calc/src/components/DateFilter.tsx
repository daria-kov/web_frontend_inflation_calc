import { Button, Form } from "react-bootstrap";

type DateFilterProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onApply: () => void;
};

function DateFilter({selectedDate, onDateChange, onApply}: DateFilterProps) {
  return (
    <Form
      className="filter-row" onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
    >
      <div className="date-input-wrap">
        <Form.Control
          type="date"
          id="date"
          className="date-input"
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
          aria-label="Фильтр по дате"
        />
      </div>

      <Button type="submit" variant="light" className="search-btn" aria-label="Поиск">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </Button>
    </Form>
  );
}

export default DateFilter;
