import { Html } from "@elysiajs/html";

export const TabHeader = () => {
  return (
    <div class="tabs">
      <input type="radio" id="radio-1" name="tabs" checked />
      <label class="tab" for="radio-1">
        Orders
        {/* <span class="notification">2</span> */}
      </label>
      {/* <input type="radio" id="radio-2" name="tabs" />
<label class="tab" for="radio-2">
  Profile
</label> */}
      {/* <input type="radio" id="radio-3" name="tabs" />
							<label class="tab" for="radio-3">
								Completed
							</label> */}
      <span class="glider" />
    </div>
  );
};
