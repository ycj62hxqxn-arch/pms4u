"use client";

export default function Disclaimer() {
  return (
    <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 p-6 rounded-lg">
      <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-3 text-lg">
        ⚠️ Important Disclaimer
      </h3>
      <ul className="text-amber-800 dark:text-amber-200 text-sm space-y-2">
        <li>
          • Displayed prices are subject to change and <strong>must be confirmed</strong> on the flight provider&apos;s checkout page before booking.
        </li>
        <li>
          • Using a VPN or proxy <strong>does not guarantee lower prices</strong>. Regional prices vary for many reasons beyond location.
        </li>
        <li>
          • IP verification may not always detect proxy usage accurately. Results are for research purposes only.
        </li>
        <li>
          • Some providers may block or restrict access from proxy networks. Availability is not guaranteed.
        </li>
        <li>
          • This tool is not affiliated with any flight provider. Always book directly through official channels.
        </li>
      </ul>
    </div>
  );
}
