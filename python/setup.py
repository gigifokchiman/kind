import os
from setuptools import setup, find_packages

setup(
    name="kind-cdktf",
    version="0.1.2",
    description="Python CDK for Terraform bindings for the KIND provider",
    long_description=open("README.md").read() if os.path.exists("README.md") else "",
    long_description_content_type="text/markdown",
    author="chimanfok",
    author_email="",
    url="https://github.com/gigifokchiman/terraform-provider-kind",
    packages=find_packages(),
    include_package_data=True,
    python_requires=">=3.7",
    install_requires=[
        "cdktf>=0.21.0,<1.0.0",
        "constructs>=10.0.0,<11.0.0",
    ],
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: System :: Systems Administration",
        "Typing :: Typed",
    ],
    keywords="terraform cdktf kind kubernetes docker infrastructure",
)