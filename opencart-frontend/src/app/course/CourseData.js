import $ from "jquery";
import "datatables.net";
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import { convertDateFormat } from "@/src/utils/function";

const CourseData = ({data}) => {
    console.log(data)
  const router = useRouter()
  const dataTableRef = useRef(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


  useEffect(() => {
    const table = $(dataTableRef.current).DataTable({
      pagingType: "numbers",
      destroy: true,
      info: false,
      language: {
        searchPlaceholder: "Search here...",
        search: "",
      },
      columnDefs: [{ targets: [1, 2, 3, 4], orderable: false }],
      responsive: true,
      data: data?.aaData,
      columns: [
        {
          title: "",
          data: null,
          orderable: false,
          render: function (data, type, row) {
            return `<input className="table_checkbox" style="width: 50px;" type="checkbox" value="${row.course_id}" />`;
          },
        },
        {
          title: 'Image',
          data: 'course_image',
          render: function (data, type, row) {
            const imageUrl = `${BASE_URL}/api/${data}`;
            return type === 'display' ? `<img src="${imageUrl}" class="source_img" alt="Course Image ${row.course_id}" />` : data;
          }
        },
        { title: "Product Name", data: "course_name", orderable: false },
        { title: "Price", data: "course_price" },
        { title: "Status", data: "course_status",  render: function (data, type, row) {
            if (data == 1) {  return "enable"} else  {return "disable"}
           
        } },
      
        {
          title: "Action",
          data: "customer_id",
          render: function (data) {
            return "edit";
          },
        },
      ],

      initComplete: function () {
        this.api().columns().every(function (index) {
          var column = this;
          if (index !== 0 && index !== 1 && index !== 5 && index !== 4) {
            var input = document.createElement("input");
            var container = document.createElement("div");
            $(container).addClass("filter-container");
            $(container).appendTo($(column.header()));
            $(input)
              .appendTo(container)
              .on("keyup change clear", function () {
                if (column.search() !== this.value) {
                  column.search(this.value).draw();
                }
              });
            $(input).attr("placeholder", "Search..."); // Set a common placeholder text
          }
        });
        var checkAllCheckbox = $(
          '<input  className="table_checkbox" style="width: 50px;" type="checkbox" id="checkAll" />'
        ).appendTo($("#example thead th:first-child"));
        checkAllCheckbox.on("change", function () {
          var checked = $(this).prop("checked");
          $("#example tbody input[type='checkbox']").prop("checked", checked);
        });
      },
    });

    
    $("#example thead input[type='checkbox']").on("change", function () {
      var checked = $(this).prop("checked");
      $("#example tbody input[type='checkbox']").prop("checked", checked);
    });

    
    return () => table.destroy();
  }, [data]);


  const handleGetSelectedIds = async () => {
    const selectedIds = $("#example tbody input[type='checkbox']:checked").map(function () {
        return this.value;
    }).get();

    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(BASE_URL + '/api/customer/mlpdelete', {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            data: JSON.stringify({ ids: selectedIds }) 
        });
       
          await getAllReworkData()
            toast.success("Customer Delete successfully.");
        
    } catch (error) {
        localStorage.clear()
        router.replace("/login");
        console.error('Error:', error.message);
    } 
};


  return (
    <>
        <table ref={dataTableRef} className="display_table" id="example" width="100%"></table>
    </>
  )
}

export default CourseData