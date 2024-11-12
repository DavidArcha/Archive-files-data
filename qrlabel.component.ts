import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-qrlabel',
  templateUrl: './qrlabel.component.html',
  styleUrl: './qrlabel.component.scss',
})
export class QRLabelComponent {
  @ViewChild('printSection') printSection!: ElementRef; // Reference to the print section

  imageUrl = '/assets/Car15.png';
  constructor(private imagePrintService: ImagePrintService) {}

  fetchAndPrintImage() {
    // Replace 'your-image-endpoint' with the actual URL or API endpoint
    this.imagePrintService.getImageBlob('endpoint').subscribe(
      (blob: Blob) => {
        this.printImageFromBlob(blob);
      },
      (error) => {
        console.error('Error fetching the image:', error);
      }
    );
  }

  // Function to print the image using the blob
  printImageFromBlob(blob: Blob) {
    const imageUrl = URL.createObjectURL(blob);

    const existingPrintSection = document.getElementById('print-section');
    if (existingPrintSection) {
      document.body.removeChild(existingPrintSection);
    }

    const printSection = document.createElement('div');
    printSection.id = 'print-section';
    printSection.innerHTML = `
      <style>
        #print-section {
          display: none; /* Hide in normal view */
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            display: block; /* Show during printing */
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      </style>
      <div
        style="width: 2cm; height: 4cm; border: 1px solid black; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 5px;">
        <img id="printableImage" src="${imageUrl}" alt="QR Code" style="width: 18mm; height: 18mm;" />
        <p style="text-align: center; margin: 5px 0; font-size: 10px; word-wrap: break-word; width: 100%;">1234</p>
        <p style="text-align: center; margin: 5px 0; font-size: 10px; word-wrap: break-word; width: 100%;">Testing Car</p>
      </div>
    `;

    document.body.appendChild(printSection);

    const image = document.getElementById('printableImage') as HTMLImageElement;
    if (image) {
      image.onload = () => {
        window.print();
        URL.revokeObjectURL(imageUrl);
      };

      image.onerror = () => {
        console.error('Failed to load the image for printing.');
      };
    } else {
      console.error('Printable image element not found.');
      URL.revokeObjectURL(imageUrl);
    }

    window.onafterprint = () => {
      const printSectionToRemove = document.getElementById('print-section');
      if (printSectionToRemove) {
        document.body.removeChild(printSectionToRemove);
      }
    };
  }
}