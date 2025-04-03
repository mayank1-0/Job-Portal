// Swal.fire({
//   title: 'Error!',
//   text: 'Do you want to continue',
//   icon: 'error',
//   confirmButtonText: 'Cool'
// });

function confirmAction(api, token, postData) {
	Swal.fire({
		title: "Are you sure?",
		text: "The status of the job will be updated with immediate effect",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Yes!"
	}).then((result) => {
		if (result.isConfirmed) {
			console.log("AJAX Call here");
			$.ajax({
				type: "PUT",
				url: api,
				dataType: "JSON",
				data: postData,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Bearer " + token);
				},
				success: function success(result) {
					successNotification(result.message);
					setTimeout(() => {
						window.location.reload();
					}, 2000);
				},
				error: function error(error) {
					// $('.custom-container').noty({text: error.responseText.message});
					errorNotification(error.responseJSON.message);
				}
			});
		}
	});
}
  
  
function confirmAlertWithReason(api, token, postData) {
	Swal.fire({
		title: "Are you sure? If yes, please type in your feedback.",
		input: "textarea",
		inputLabel: "Feedback/Reason",
		inputPlaceholder: "Type your feedback/reason here...",
		inputAttributes: {
			autocapitalize: "off"
		},
		showCancelButton: true,
		confirmButtonText: "Submit",
		showLoaderOnConfirm: true,
	}).then((result) => {
		if (result.isConfirmed) {
			if (result.value === "") {
				errorNotification("Please enter a Feedback/Reason");
			} else {
				Swal.showLoading();
				postData.reason = result.value;
				console.log("AJAX Call here");
				$.ajax({
					type: "PUT",
					url: api,
					dataType: "JSON",
					data: postData,
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Authorization", "Bearer " + token);
					},
					success: function success(result) {
						successNotification(result.message);
						setTimeout(() => {
							window.location.reload();
						}, 3000);
					},
					error: function error(error) {
						// $('.custom-container').noty({text: error.responseText.message});
						errorNotification(error.responseJSON.message);
					}
				});
			}
		}
	});
}