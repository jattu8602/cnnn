"use client";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import SubCard from "@/components/cards/SubCard";
import NoDataFound from "@/components/ui/NoDataFound";
import { useFilterSubject } from "@/libs/hooks/useSubject";
import SkeletonLoading from "@/components/ui/SkeletonLoading";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ViewSubjects = ({ course, semester }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const course = searchParams.get("name");
  // const semester = searchParams.get("sem");
  const category = searchParams.get("category");

  const {
    data: fetchedData,
    error,
    isLoading: loading,
  } = useFilterSubject({ course, semester });

  useEffect(() => {
    if (fetchedData) {
      setUserSelectedData(fetchedData);
    }
    if (error) {
      console.error("Error fetching table data:", error);
      toast.error("Something went wrong in fetching Subjects");
    }
  }, [fetchedData, error]);

  const [userSelectedData, setUserSelectedData] = useState([]);
  const data = useMemo(() => userSelectedData, [userSelectedData]);

  return (
    <div>
      <div className="flex items-center gap-2">
      {/* Back Button */}
      <button onClick={() => router.back()} aria-label="Go Back">
        <ArrowLeft className="w-6 h-6" />
      </button>
        <h1 className="select_header">Select Subjects</h1>
      </div>
      <small className="text-gray-400">
        Path: /rgpv/
        <Link href={`/rgpv/${course}`} className="text-blue-500 hover:underline">{course}</Link>
        /{semester}
      </small>

      <div className="items-center">
        {loading ? (
          <SkeletonLoading />
        ) : (
          <>
            {data.length === 0 ? (
              <NoDataFound />
            ) : (
              <div className="grid md:grid-cols-2 mt-[18px] gap-[10px]">
                {data.map((item, index) => (
                  <SubCard
                    key={index}
                    hrefData={{
                      pathname: `/rgpv/${course}/${semester}/${item.subject_code}`, // Constructing the path dynamically
                    }}
                    data={item}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default ViewSubjects;
