export interface CourseOffer {
  courseOfferId: string;
  course: {
    name: string;
    courseCode: string;
    prerequisites: string[];
    courseDescription: string;
  };
  term: {
    year: number;
    semester: 'SPRING' | 'SUMMER' | 'FALL';
  };
  faculty: string;
  maxSeats: number;
}