export function convertDateFormat(dateString) {
    // Create a Date object from the input string
    const dateObject = new Date(dateString);
  
    // Extract year, month, and day components
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
  
    // Construct the desired date format
    const formattedDate = `${day}/${month}/${year}`;
  
    return formattedDate;
  }
  