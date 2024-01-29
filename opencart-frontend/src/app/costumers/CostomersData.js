import $ from "jquery";
import "datatables.net";
import React, { useEffect, useRef, useState } from "react";
import { convertDateFormat } from "@/src/utils/function";
import axios from "axios";
import { useRouter } from "next/navigation";

const CostomersData = ({ data }) => {
  
  const router = useRouter()
  const dataTableRef = useRef(null);
  const [loading, setLoading] = useState(false);
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
      columnDefs: [{ targets: [1, 2, 3, 4, 5, 6], orderable: false }],
      responsive: true,
      data: data?.aaData,
      columns: [
        {
          title: "",
          data: null,
          orderable: false,
          render: function (data, type, row) {
            return `<input className="table_checkbox" style="width: 50px;" type="checkbox" value="${row.customer_id}" />`;
          },
        },
        { title: "Customer Name", data: "name", orderable: false },
        { title: "E-mail", data: "email" },
        { title: "Status", data: "status" },
        { title: "IP", data: "ip" },
        {
          title: "Date Added",
          data: "create_at",
          render: function (data) {
            return convertDateFormat(data);
          },
        },
        {
          title: "Login into Store",
          data: "device_info",
        },
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
          if (index !== 0 && index !== 7 && index !== 5) {
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

    console.log("Selected IDs:", selectedIds);

    try {
      const token = localStorage.getItem('authToken');
      console.log(token)
        const response = await axios.delete(BASE_URL + '/api/customer/mlpdelete', {"ids": ['12']}, {
          headers: {
            'Content-Type': 'application/json',
              'x-access-token': token
          },
        });
        if (response.data.user == false) {
          router.replace("/login")
        } else if (response.data.user == true) {
          toast.success("Customer Delete successfully.")
        }
        console.log(response)
        console.log('Response:', response.data);
      } catch (error) {
        // Handle errors
        console.error('Error:', error.message);
      } finally {
      }
  };

  
  return (
    <>
      {/* <div className="select_box"></div> */}
      {/* <div className="select_box"> */}
        <button className="btn" type="button" onClick={() => handleGetSelectedIds()}>delete</button>
      {/* </div> */}
      <table ref={dataTableRef} className="display_table" id="example" width="100%"></table>
    </>
  );
};

export default CostomersData;
